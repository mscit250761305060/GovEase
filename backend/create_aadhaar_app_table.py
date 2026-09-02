import asyncio
import os
from dotenv import load_dotenv

load_dotenv(override=True)

from sqlalchemy import create_engine
from app.models.mock_government import AadhaarUpdateApplication
from app.database import Base, DATABASE_URL

engine = create_engine(DATABASE_URL)

def main():
    print("Creating AadhaarUpdateApplication table...")
    AadhaarUpdateApplication.__table__.create(engine, checkfirst=True)
    print("Done!")

if __name__ == "__main__":
    main()
