import psycopg2

# -----------------------
# Modify to your local PostgreSQL settings
# -----------------------
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="postgres",
    user="postgres",
    password="1234"   # ← Change to your own password
)

cursor = conn.cursor()

# -----------------------
# CREATE TABLE SQL
# -----------------------

sql = """

CREATE TABLE IF NOT EXISTS EMPLOYEE_MASTER (
    Employee_ID            VARCHAR PRIMARY KEY,
    Full_Name              VARCHAR,
    Date_of_Birth          DATE,
    Gender                 VARCHAR,
    Contact_Details        VARCHAR,
    Address                VARCHAR,
    Emergency_Contact      VARCHAR,
    Employment_Status      VARCHAR,
    Hire_Date              DATE,
    Termination_Date       DATE,
    Job_Title              VARCHAR,
    Department             VARCHAR,
    Office_Location        VARCHAR,
    Region_State           VARCHAR,
    Country                VARCHAR,
    Manager_ID             VARCHAR REFERENCES EMPLOYEE_MASTER(Employee_ID),
    Award_Agreement        VARCHAR,
    Employment_Type        VARCHAR
);

CREATE TABLE IF NOT EXISTS REMUNERATION (
    Employee_ID                   VARCHAR REFERENCES EMPLOYEE_MASTER(Employee_ID),
    Base_Salary                   NUMERIC,
    Award_Classification_Level    VARCHAR,
    Allowances                    NUMERIC,
    Commission                    NUMERIC,
    Commission_Percent            NUMERIC,
    Commission_Earned             NUMERIC,
    Overtime_Rate                 NUMERIC,
    Superannuation_Percent        NUMERIC,
    Bonus_Eligibility             BOOLEAN,
    Pay_Cycle                     VARCHAR,
    Salary                        NUMERIC,
    Commission_Dollar             NUMERIC,
    Total_Package_Value           NUMERIC
);

CREATE TABLE IF NOT EXISTS POSITION_DETAILS (
    Employee_ID         VARCHAR REFERENCES EMPLOYEE_MASTER(Employee_ID),
    Position_Title      VARCHAR,
    Position_Level      VARCHAR,
    Skills_Required     VARCHAR,
    Qualifications      VARCHAR,
    Qualification_Date  DATE,
    Expiry_Date         DATE,
    Licenses_Permits    VARCHAR,
    Competency_Status   VARCHAR
);

CREATE TABLE IF NOT EXISTS PERFORMANCE (
    Employee_ID             VARCHAR REFERENCES EMPLOYEE_MASTER(Employee_ID),
    Review_Date             DATE,
    Performance_Rating      VARCHAR,
    Potential_Rating        VARCHAR,
    Time_in_Role            VARCHAR,
    Goals_Objectives        VARCHAR,
    Achievement_Status      VARCHAR,
    Development_Plan_Status VARCHAR,
    Last_Promotion_Date     DATE,
    Next_Review_Date        DATE
);

"""

# -----------------------
# Execute creation
# -----------------------
cursor.execute(sql)
conn.commit()

print("All tables successfully created in PostgreSQL.")

cursor.close()
conn.close()
