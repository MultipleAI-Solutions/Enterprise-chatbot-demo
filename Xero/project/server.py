import json
import sys
import io
import psycopg2
from mcp.server.fastmcp import FastMCP

# Set Windows console output encoding to UTF-8
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# -------------------------------
# PostgreSQL Connection Configuration
# -------------------------------
PG_USER = "postgres"
PG_PASSWORD = "1234"
PG_HOST = "localhost"
PG_PORT = "5432"
PG_DB = "postgres"

# Global database connection
_conn = None
_cursor = None

def get_db_connection():
    """Get database connection"""
    global _conn, _cursor
    if _conn is None or _conn.closed:
        _conn = psycopg2.connect(
            host=PG_HOST,
            port=PG_PORT,
            database=PG_DB,
            user=PG_USER,
            password=PG_PASSWORD
        )
        _cursor = _conn.cursor()
    return _conn, _cursor

# -------------------------------
# Create FastMCP Server
# -------------------------------
mcp = FastMCP("HR Database Server")

# -------------------------------
# Define Query Tools
# -------------------------------
@mcp.tool()
def query_employees(
    table: str,
    limit: int = 10,
    employee_id: str = None,
    department: str = None
) -> str:
    """
    Query employee database
    
    Args:
        table: Table name (employee_master, remuneration, position_details, performance)
        limit: Number of rows to return, default 10
        employee_id: Employee ID, optional
        department: Department, optional
    
    Returns:
        JSON-formatted query results
    """
    # Table name whitelist
    allowed_tables = ["employee_master", "remuneration", "position_details", "performance"]
    if table not in allowed_tables:
        return json.dumps({"error": f"Table {table} is not allowed"}, ensure_ascii=False, indent=2)
    
    try:
        conn, cursor = get_db_connection()
        
        # Build SQL
        sql = f"SELECT * FROM {table}"
        params = []
        conditions = []
        
        if employee_id:
            conditions.append("employee_id = %s")
            params.append(employee_id)
        
        if department:
            conditions.append("department = %s")
            params.append(department)
        
        if conditions:
            sql += " WHERE " + " AND ".join(conditions)
        
        sql += f" LIMIT {limit}"
        
        # Execute query
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        result = [dict(zip(columns, r)) for r in rows]
        
        return json.dumps(result, ensure_ascii=False, indent=2, default=str)
    
    except Exception as e:
        return json.dumps({"error": f"Query failed: {str(e)}"}, ensure_ascii=False, indent=2)

# -------------------------------
# Run Server
# -------------------------------
if __name__ == "__main__":
    import sys
    
    print("=" * 60)
    print("HR Database MCP Server")
    print("=" * 60)
    print(f"Database: {PG_DB}@{PG_HOST}:{PG_PORT}")
    print("=" * 60)
    
    # Check command line arguments
    transport = "stdio"  # Default to stdio (MCP client calls)
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--sse":
            transport = "sse"
            print("Using SSE transport mode")
        elif sys.argv[1] == "--http":
            transport = "streamable-http"
            print("Using HTTP transport mode")
        elif sys.argv[1] == "--https":
            # HTTPS REST API mode
            from flask import Flask, request, jsonify
            from flask_cors import CORS
            import ssl
            
            app = Flask(__name__)
            CORS(app)  # Allow cross-origin requests
            
            @app.route('/query', methods=['POST', 'GET'])
            def api_query():
                """REST API query endpoint"""
                try:
                    if request.method == 'GET':
                        params = request.args.to_dict()
                    else:
                        params = request.json or {}
                    
                    table = params.get('table', 'employee_master')
                    limit = int(params.get('limit', 10))
                    employee_id = params.get('employee_id')
                    department = params.get('department')
                    
                    result = query_employees(
                        table=table,
                        limit=limit,
                        employee_id=employee_id,
                        department=department
                    )
                    return jsonify(json.loads(result))
                except Exception as e:
                    return jsonify({"error": str(e)}), 500
            
            @app.route('/health', methods=['GET'])
            def health():
                """Health check"""
                return jsonify({"status": "ok", "database": PG_DB})
            
            print("Using HTTPS REST API mode")
            print("API endpoint: https://localhost:8443/query")
            print("Health check: https://localhost:8443/health")
            print("=" * 60)
            
            # Create self-signed certificate (for development only)
            context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            try:
                context.load_cert_chain('server.crt', 'server.key')
            except FileNotFoundError:
                print("Warning: server.crt and server.key not found, using HTTP mode")
                print("Hint: You can generate certificates using openssl:")
                print("  openssl req -x509 -newkey rsa:4096 -nodes -keyout server.key -out server.crt -days 365")
                app.run(host='0.0.0.0', port=8443, debug=False)
            else:
                app.run(host='0.0.0.0', port=8443, ssl_context=context, debug=False)
            sys.exit(0)
        elif sys.argv[1] == "--test":
            # Test mode: directly test query functionality
            print("\nTest mode: Testing query functionality...")
            result = query_employees(table="employee_master", limit=3)
            print(result)
            sys.exit(0)
    
    if transport == "stdio":
        print("=" * 60)
    
    # Run FastMCP server
    try:
        mcp.run(transport=transport)
    except KeyboardInterrupt:
        print("\nServer stopped")
    finally:
        if _conn and not _conn.closed:
            _cursor.close()
            _conn.close()
            print("Database connection closed")
