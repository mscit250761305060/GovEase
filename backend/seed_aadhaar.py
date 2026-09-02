from app.database import SessionLocal, engine
from app.models.mock_government import MockAadhaarRecord
from app.database import Base

Base.metadata.create_all(bind=engine)

db = SessionLocal()
aadhaar_num = "6654 7400 0000"
existing = db.query(MockAadhaarRecord).filter_by(aadhaar_number=aadhaar_num).first()
if not existing:
    record = MockAadhaarRecord(
        aadhaar_number=aadhaar_num,
        name="Khokhneshiya Zeel Maheshbhai",
        dob="16-11-2007",
        address="23, paramhans society, aambatalawadi, katargam, surat, 395004",
        gender="male",
        mobile="9106416157",
        email="jeelkhokhaneshiya@gmail.com"
    )
    db.add(record)
    db.commit()
    print("Record inserted successfully!")
else:
    print("Record already exists!")
db.close()
