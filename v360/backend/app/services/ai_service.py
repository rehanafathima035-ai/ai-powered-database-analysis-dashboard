import os
import mysql.connector
import pandas as pd
from groq import Groq
from dotenv import load_dotenv
import re
import json

# Load .env from project root
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env')
load_dotenv(dotenv_path if os.path.exists(dotenv_path) else '.env')

class AIService:
    def __init__(self):
        groq_api_key = os.getenv("GROQ_API_KEY")
        self.groq_client = Groq(api_key=groq_api_key)
        self.model = "llama-3.3-70b-versatile"
        
        self.mysql_config = {
            'host': os.getenv("MYSQL_HOST", "localhost"),
            'port': os.getenv("MYSQL_PORT", "3306"),
            'user': os.getenv("MYSQL_USER", "root"),
            'password': os.getenv("MYSQL_PASSWORD", "Rehana@366"),
            'database': os.getenv("MYSQL_DATABASE", "v360")
        }
        self.conn = None

    def _get_connection(self):
        if self.conn is None or not self.conn.is_connected():
            self.conn = mysql.connector.connect(
                host=self.mysql_config['host'],
                user=self.mysql_config['user'],
                password=self.mysql_config['password'],
                database=self.mysql_config['database'],
                port=int(self.mysql_config['port'])
            )
        return self.conn

    def get_schema(self):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE()")
        columns = cursor.fetchall()
        
        schema = {}
        for table_name, column_name, data_type in columns:
            if table_name not in schema:
                schema[table_name] = []
            schema[table_name].append(f"{column_name} ({data_type})")
        
        schema_text = ""
        for table, cols in schema.items():
            schema_text += f"Table: {table}\nColumns: {', '.join(cols)}\n\n"
        
        cursor.close()
        return schema_text

    def validate_sql(self, sql: str):
        # Normalize whitespace and lowercase for checking
        clean_sql = re.sub(r'\s+', ' ', sql).strip().upper()
        
        # Blocked keywords
        blocked = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'TRUNCATE', 'ALTER', 'CREATE']
        for keyword in blocked:
            if re.search(rf'\b{keyword}\b', clean_sql):
                return False, f"SQL Error: {keyword} statements are not allowed."
        
        # Allowed starters
        allowed_starters = ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN', 'WITH']
        if not any(clean_sql.startswith(starter) for starter in allowed_starters):
            return False, "SQL Error: Only read-only queries (SELECT, SHOW, DESCRIBE, EXPLAIN) are allowed."
            
        return True, ""

    def generate_sql(self, question: str):
        schema = self.get_schema()
        prompt = f"""
        You are a MySQL expert. Given the following database schema, generate a SQL query to answer the user's question.
        Return ONLY the SQL query. Do not include markdown formatting or explanations.
        
        Schema:
        {schema}
        
        User Question: {question}
        
        SQL:
        """
        
        response = self.groq_client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        sql = response.choices[0].message.content.strip()
        # Clean up possible markdown
        sql = re.sub(r'```sql\n?|```', '', sql).strip()
        return sql

    def run_sql(self, sql: str):
        is_safe, error_msg = self.validate_sql(sql)
        if not is_safe:
            raise ValueError(error_msg)
            
        conn = self._get_connection()
        return pd.read_sql(sql, conn)

    def generate_insights(self, question: str, sql: str, df: pd.DataFrame):
        if df.empty:
            return "No data found to generate insights."
            
        data_str = df.head(10).to_string()
        prompt = f"""
        User Question: {question}
        SQL Executed: {sql}
        Data Preview (Top 10 rows):
        {data_str}
        
        Provide professional business insights based on this data. 
        Focus on key findings, trends, and recommendations.
        Keep it concise (100-150 words).
        """
        
        response = self.groq_client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()

    def generate_stat_summary(self, df: pd.DataFrame):
        if df.empty:
            return "No statistics available."
            
        summary = df.describe(include='all').to_string()
        prompt = f"""
        Analyze these statistics and provide a 2-3 sentence executive summary of the data distribution:
        
        {summary}
        """
        
        response = self.groq_client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()

    def get_chart_data(self, df: pd.DataFrame):
        if df.empty or len(df.columns) < 2:
            return {"chart_type": "table", "labels": [], "values": []}

        cols = df.columns.tolist()
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        datetime_cols = df.select_dtypes(include=['datetime', 'datetimetz']).columns.tolist()
        # Treat object/category as categorical
        categorical_cols = [c for c in cols if c not in numeric_cols and c not in datetime_cols]

        chart_type = "bar"
        labels = []
        values = []

        # Rule 3: Date/time column + numeric column → line chart
        if datetime_cols and numeric_cols:
            chart_type = "line"
            labels = df[datetime_cols[0]].dt.strftime('%Y-%m-%d').tolist()
            values = df[numeric_cols[0]].tolist()
        
        # Rule 1: 1 category column + 1 numeric column → pie chart
        elif len(categorical_cols) == 1 and len(numeric_cols) >= 1:
            chart_type = "pie"
            labels = df[categorical_cols[0]].astype(str).tolist()
            values = df[numeric_cols[0]].tolist()
            
        # Rule 2: Multiple categories → bar chart
        elif len(categorical_cols) > 1:
            chart_type = "bar"
            # For simplicity, use the first category as labels and first numeric as values
            labels = df[categorical_cols[0]].astype(str).tolist()
            if numeric_cols:
                values = df[numeric_cols[0]].tolist()
            else:
                # Count frequency if no numeric column
                values = [1] * len(df)
        
        else:
            # Fallback to bar with first two columns
            chart_type = "bar"
            labels = df[cols[0]].astype(str).tolist()
            if numeric_cols:
                values = df[numeric_cols[0]].tolist()
            else:
                values = [0] * len(df)

        return {
            "chart_type": chart_type,
            "labels": labels,
            "values": [float(v) if isinstance(v, (int, float)) else v for v in values]
        }

ai_service = AIService()
