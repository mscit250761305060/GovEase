from sqlalchemy import create_engine

engine = create_engine("postgresql://postgres:Talent%402007%23@localhost:5433/govease_db")
try:
    with engine.connect() as conn:
        print("SQLAlchemy connection successful on 5433!")
except Exception as e:
    print("SQLAlchemy connection failed:", e)
