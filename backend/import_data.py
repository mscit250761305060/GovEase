import csv
import io
from app.database import SessionLocal
from app.models.mock_government import MockAadhaarRecord

csv_data = """Aadhaar_number,name,Date of Birth,Address,Gender,Mobile,Email
1234 5678 9101,Jeel Maheshbhai Khokhaneshiya,16-11-2007,"23, paramhans society, aambatalawadi, katargam, surat, 395004.",male,9144567895,jeelkhokhaneshiya@gmail.com"""

reader = csv.DictReader(io.StringIO(csv_data))
db = SessionLocal()

for row in reader:
    aadhaar_cleaned = row['Aadhaar_number'].replace(' ', '')
    
    existing = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == aadhaar_cleaned).first()
    if existing:
        print(f'Record for {aadhaar_cleaned} already exists, skipping.')
        continue
        
    record = MockAadhaarRecord(
        aadhaar_number=aadhaar_cleaned,
        name=row['name'],
        dob=row['Date of Birth'],
        address=row['Address'],
        gender=row['Gender'].capitalize(),
        mobile=row['Mobile'],
        email=row['Email']
    )
    db.add(record)
    
db.commit()
db.close()
print('Data imported successfully!')
