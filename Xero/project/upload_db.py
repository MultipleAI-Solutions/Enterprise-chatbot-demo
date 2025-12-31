import os
import sys
import pandas as pd
from sqlalchemy import create_engine, inspect
from datetime import datetime

# Set Windows console output encoding to UTF-8
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# === PostgreSQL Connection Configuration ===
# Please modify these parameters according to the configuration in create_db.py
PG_USER = "postgres"
PG_PASSWORD = "1234"  # Modify according to password in create_db.py
PG_HOST = "localhost"
PG_PORT = "5432"
PG_DB = "postgres"  # Modify according to database name in create_db.py

engine = create_engine(
    f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DB}"
)

# === CSV File Path ===
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_FOLDER = os.path.join(BASE_DIR, "table")

# === CSV File to Database Table Mapping ===
CSV_TABLE_MAPPING = {
    "Employee Master.csv": {
        "table": "employee_master",
        "column_mapping": {
            "Employee ID": "employee_id",
            "Full Name": "full_name",
            "Date of Birth": "date_of_birth",
            "Gender": "gender",
            "Contact Details": "contact_details",
            "Address": "address",
            "Emergency Contact": "emergency_contact",
            "Employment Status": "employment_status",
            "Hire Date": "hire_date",
            "Termination Date": "termination_date",
            "Job Title": "job_title",
            "Department": "department",
            "Office Location": "office_location",
            "Region/State": "region_state",
            "Country": "country",
            "Manager": "manager_id",
            "Award/Agreement": "award_agreement",
            "Employment Type": "employment_type"
        }
    },
    "Remuneration.csv": {
        "table": "remuneration",
        "column_mapping": {
            "Employee ID": "employee_id",
            "Base Salary": "base_salary",
            "Award/Classification Level": "award_classification_level",
            "Allowances": "allowances",
            "Commission": "commission",
            "Commission %": "commission_percent",
            "Commision Earned": "commission_earned",
            "Overtime Rate": "overtime_rate",
            "Superannuation %": "superannuation_percent",
            "Bonus Eligibility": "bonus_eligibility",
            "Pay Cycle": "pay_cycle",
            "Salary": "salary",
            "Commission $": "commission_dollar",
            "Total Package Value": "total_package_value"
        }
    },
    "Position Details.csv": {
        "table": "position_details",
        "column_mapping": {
            "Employee ID": "employee_id",
            "Position Title": "position_title",
            "Position Level ": "position_level",
            "Skills Required": "skills_required",
            "Qualifications": "qualifications",
            "Qualification Date": "qualification_date",
            "Expiry Date": "expiry_date",
            "Licenses/Permits": "licenses_permits",
            "Competency Status": "competency_status"
        }
    },
    "Performance.csv": {
        "table": "performance",
        "column_mapping": {
            "Employee ID": "employee_id",
            "Review Date": "review_date",
            "Performance Rating": "performance_rating",
            "Potential Rating": "potential_rating",
            "Time in Role": "time_in_role",
            "Goals/Objectives": "goals_objectives",
            "Achievement Status": "achievement_status",
            "Development Plan Status": "development_plan_status",
            "Last Promotion Date": "last_promotion_date",
            "Next Review Date": "next_review_date"
        }
    }
}


def process_dataframe(df, table_name):
    """Process dataframe: convert data types"""
    # Process different data types based on table name
    if table_name == "employee_master":
        # Date fields
        date_cols = ["date_of_birth", "hire_date", "termination_date"]
        for col in date_cols:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
    
    elif table_name == "remuneration":
        # Numeric fields
        numeric_cols = ["base_salary", "allowances", "commission", "commission_percent", 
                       "commission_earned", "overtime_rate", "superannuation_percent",
                       "salary", "commission_dollar", "total_package_value"]
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Boolean fields
        if "bonus_eligibility" in df.columns:
            df["bonus_eligibility"] = df["bonus_eligibility"].apply(
                lambda x: True if str(x).strip().lower() in ['yes', 'true', '1'] else False
            )
    
    elif table_name == "position_details":
        # Date fields
        date_cols = ["qualification_date", "expiry_date"]
        for col in date_cols:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
    
    elif table_name == "performance":
        # Date fields
        date_cols = ["review_date", "last_promotion_date", "next_review_date"]
        for col in date_cols:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
    
    return df


def upload_csv_to_postgres():
    """Upload CSV files to PostgreSQL (only insert data, do not create tables)"""
    print(f"📁 CSV folder path: {CSV_FOLDER}\n")
    
    # Check database connection and if tables exist
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    # Debug: display all existing tables
    print(f"📋 Existing tables in database: {existing_tables}\n")
    
    # Define insertion order: insert employee_master (main table) first, then other tables (dependent tables)
    insertion_order = [
        "Employee Master.csv",  # Must be inserted first
        "Remuneration.csv",
        "Position Details.csv",
        "Performance.csv"
    ]
    
    # Process files in defined order
    for csv_file in insertion_order:
        if csv_file not in CSV_TABLE_MAPPING:
            continue
            
        config = CSV_TABLE_MAPPING[csv_file]
        csv_path = os.path.join(CSV_FOLDER, csv_file)
        table_name = config["table"]
        column_mapping = config["column_mapping"]
        
        if not os.path.exists(csv_path):
            print(f" File does not exist: {csv_file}")
            continue
        
        # Check if table exists
        if table_name not in existing_tables:
            print(f" Table does not exist: {table_name}")
            print(f"   Please run create_db.py first to create tables")
            continue
        
        print(f"📄 Processing: {csv_file}")
        print(f"   → Target table: {table_name} (exists)")
        
        try:
            # Read CSV file
            df = pd.read_csv(csv_path)
            print(f"    Read successfully, {len(df)} rows of data")
            
            # Rename columns to match database table
            df = df.rename(columns=column_mapping)
            
            # Keep only mapped columns (remove extra columns)
            df = df[[col for col in column_mapping.values() if col in df.columns]]
            
            # Process data types
            df = process_dataframe(df, table_name)
            
            # Special handling: manager_id foreign key constraint for employee_master table
            if table_name == "employee_master" and "manager_id" in df.columns:
                # Create mapping from employee_id to job_title and department
                employee_info = {}
                for _, row in df.iterrows():
                    employee_info[row["employee_id"]] = {
                        "job_title": row.get("job_title", ""),
                        "department": row.get("department", "")
                    }
                
                # Intelligently infer Manager relationship
                def infer_manager(employee_id, manager_value, job_title, department):
                    # If already a valid employee_id, return directly
                    if pd.notna(manager_value) and str(manager_value).strip() in employee_info:
                        return str(manager_value).strip()
                    
                    # CEO has no Manager
                    if job_title == "CEO":
                        return None
                    
                    # Executive Assistant's Manager is CEO
                    if job_title == "Executive Assistant":
                        return "E001"
                    
                    # CFO's Manager is CEO
                    if job_title == "Chief Financial Officer":
                        return "E001"
                    
                    # Finance department employees, Manager is CFO
                    if department == "Finance" and job_title != "Chief Financial Officer":
                        return "E003"
                    
                    # Sales Manager's Manager is CEO
                    if job_title == "Sales Manager":
                        return "E001"
                    
                    # Sales Team Leader's Manager is Sales Manager
                    if job_title == "Sales Team Leader":
                        return "E007"
                    
                    # Sales Rep's Manager is the first Sales Team Leader
                    if job_title == "Sales Rep":
                        return "E008"  # Or can choose E009 based on other rules
                    
                    # Operations Manager's Manager is CEO
                    if job_title == "Operations Manager":
                        return "E001"
                    
                    # Operations Staff's Manager is Operations Manager
                    if department == "Operations" and job_title == "Operations Staff":
                        return "E016"
                    
                    # Other cases return NULL
                    return None
                
                # Apply inference logic
                df["manager_id"] = df.apply(
                    lambda row: infer_manager(
                        row["employee_id"],
                        row["manager_id"],
                        row.get("job_title", ""),
                        row.get("department", "")
                    ),
                    axis=1
                )
            
            # Only insert data, do not create table (use append mode, table must exist)
            df.to_sql(
                table_name,
                engine,
                if_exists="append",  # append mode: only insert data, will error if table doesn't exist
                index=False,
                method='multi'  # Batch insert for better performance
            )
            
            print(f"    Successfully inserted {len(df)} rows into table {table_name}\n")
            
        except Exception as e:
            print(f"    Upload failed: {str(e)}\n")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    print("=" * 60)
    print("Start uploading CSV data to PostgreSQL")
    print("=" * 60 + "\n")
    
    upload_csv_to_postgres()
    
    print("=" * 60)
    print(" All CSV files processed!")
    print("=" * 60)
