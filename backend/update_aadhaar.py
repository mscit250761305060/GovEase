from sqlalchemy import create_engine, text

engine = create_engine("postgresql://postgres:Talent%402007%23@localhost:5433/govease_db")
with engine.connect() as conn:
    conn.execute(text("UPDATE mock_aadhaar_records SET aadhaar_number='665474168409' WHERE aadhaar_number='665474000000';"))
    conn.execute(text("INSERT INTO mock_aadhaar_records (aadhaar_number, name, dob, address, gender, mobile, email, created_at) VALUES ('665474168409', 'Khokhneshiya Zeel Maheshbhai', '16-11-2007', '23, paramhans society, aambatalawadi, katargam, surat, 395004', 'male', '9106416157', 'jeelkhokhaneshiya@gmail.com', CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;"))
    conn.commit()
    print("Updated successfully")
