import csv
import sys
from app.database import SessionLocal, engine
from app.models.mock_government import MockAadhaarRecord
from app.database import Base

Base.metadata.create_all(bind=engine)

def import_csv(file_path):
    db = SessionLocal()
    try:
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                aadhaar_number = row.get("Aadhaar_number").strip()
                if not aadhaar_number:
                    continue
                
                # Check if exists
                existing = db.query(MockAadhaarRecord).filter_by(aadhaar_number=aadhaar_number).first()
                if existing:
                    existing.name = row.get("name")
                    existing.dob = row.get("Date of Birth")
                    existing.address = row.get("Address")
                    existing.gender = row.get("Gender")
                    existing.mobile = row.get("Mobile")
                    existing.email = row.get("Email")
                else:
                    new_record = MockAadhaarRecord(
                        aadhaar_number=aadhaar_number,
                        name=row.get("name"),
                        dob=row.get("Date of Birth"),
                        address=row.get("Address"),
                        gender=row.get("Gender"),
                        mobile=row.get("Mobile"),
                        email=row.get("Email")
                    )
                    db.add(new_record)
        db.commit()
        print("Import successful!")
    except Exception as e:
        print(f"Error importing CSV: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    csv_file = sys.argv[1]
    import_csv(csv_file)
