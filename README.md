# Project Setup Guide

This repository provides a complete pipeline to:

* Create a **Supabase (PostgreSQL) database** based on the provided Python schema(create_db.py)
* Upload data into Supabase using `upload_db.py`
* Start a backend service with `server.py`
* Import a prepared `.json` configuration into **Flowise**
* Connect Flowise to Supabase using the **MCP node**
* Obtain a **chatbot link** that can be embedded directly into a frontend application

---

## 1. Prerequisites

Before you start, make sure you have the following:

* Python 3.9+
* A Supabase account and project
* Node.js 18+ (required for Flowise)
* Flowise installed (local or hosted)
* Git

---

## 2. Supabase Setup

1. Create a new project in Supabase.
2. Copy the following credentials from **Project Settings → Database / API**:

   * `SUPABASE_URL`
   * `SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY`
   * Database connection string (if required)
3. Create a `.env` file in the project root:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

---

## 3. Database Creation (Schema)

The database schema is defined directly in the Python code.

* Review the schema logic in the relevant Python files (models / table definitions).
* Tables will be created automatically when running the upload script or server (depending on implementation).

> Make sure the Supabase project uses **PostgreSQL** (default).

---

## 4. Upload Data to Supabase

Use `upload.py` to insert data into Supabase.

```bash
python upload.py
```

What this script does:

* Connects to Supabase using environment variables
* Creates tables if they do not exist
* Uploads structured data into the database

Verify the data in **Supabase → Table Editor** after execution.

---

## 5. Run Backend Server

Start the backend service:

```bash
python server.py
```

This server:

* Exposes database access logic
* Acts as the backend layer for MCP / Flowise
* Ensures the database is queryable by AI tools

Keep this server running while testing the chatbot.

---

## 6. Flowise Setup

### 6.1 Import Flowise JSON

1. Open Flowise UI
2. Go to **Chatflows → Import**
3. Import the provided `.json` file from this repository

This will load a preconfigured chatflow.

---

### 6.2 Connect MCP Node to Supabase

Inside Flowise:

1. Open the imported chatflow
2. Locate the **MCP node**
3. Configure MCP with:

   * Backend server URL (from `server.py`)
   * Database connection settings (if required)
4. Save the chatflow

Once connected, the MCP node will query Supabase directly.

---

## 7. Get Chatbot Link

After saving the chatflow:

1. Click **Deploy / Share** in Flowise
2. Copy the generated chatbot URL

This link:

* Can be opened directly in a browser
* Can be embedded into any frontend page

---

## 8. Frontend Integration

Example iframe embed:

```html
<iframe
  src="YOUR_FLOWISE_CHATBOT_LINK"
  width="100%"
  height="600"
  style="border: none;"
></iframe>
```

You can also integrate it programmatically depending on your frontend framework (React / Next.js / Vue, etc.).

---

## 9. Project Flow Summary

```
Python Schema
   ↓
Supabase (PostgreSQL)
   ↓
upload.py (data ingestion)
   ↓
server.py (backend service)
   ↓
Flowise (.json import)
   ↓
MCP Node (DB access)
   ↓
Chatbot Link
   ↓
Frontend Embed
```

---

## 10. Notes

* Ensure environment variables are correctly set before running scripts
* Do not expose Supabase service role keys in frontend code
* Keep `server.py` protected if deployed publicly
