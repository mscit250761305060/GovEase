import asyncio
import os
from dotenv import load_dotenv
from sqlalchemy import text

load_dotenv(override=True)

from sqlalchemy import create_engine
from app.database import DATABASE_URL

engine = create_engine(DATABASE_URL)

def main():
    print("Upgrading AadhaarUpdateHistory and AadhaarUpdateApplication tables...")
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE aadhaar_update_history ADD COLUMN user_id INTEGER;"))
            print("Added user_id to aadhaar_update_history.")
        except Exception as e:
            print(f"Skipping history table: {e}")
            
        try:
            conn.execute(text("ALTER TABLE aadhaar_update_applications ADD COLUMN user_id INTEGER;"))
            print("Added user_id to aadhaar_update_applications.")
        except Exception as e:
            print(f"Skipping applications table: {e}")
            
        conn.commit()
    print("Done!")

if __name__ == "__main__":
    main()
