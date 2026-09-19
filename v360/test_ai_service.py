import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.ai_service import ai_service
import pandas as pd

def test_query(question):
    print(f"\nQuestion: {question}")
    try:
        sql = ai_service.generate_sql(question)
        print(f"Generated SQL: {sql}")
        
        df = ai_service.run_sql(sql)
        print(f"Result Rows: {len(df)}")
        
        chart_data = ai_service.get_chart_data(df)
        print(f"Chart Data: {chart_data}")
        
        insights = ai_service.generate_insights(question, sql, df)
        print(f"Insights: {insights[:200]}...")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Test a few scenarios
    test_query("Show me all tables")
    test_query("What are the columns in the users table?")
    # Try an unsafe query
    test_query("DROP TABLE test")
