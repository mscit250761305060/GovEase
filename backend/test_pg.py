import psycopg2
import sys

def test_conn():
    try:
        conn = psycopg2.connect(
            dbname="govease_db",
            user="postgres",
            password="Talent@2007#",
            host="localhost",
            port="5433"
        )
        print("Connection Successful!")
        conn.close()
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    test_conn()
