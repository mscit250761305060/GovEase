import json
from sqlalchemy.orm import Session
from app.models.application import Application
from app.models.mock_government import MockAadhaarRecord, MockPanRecord, MockVoterRecord, MockDLRecord

from app.models.service import GovernmentService

def sync_document_update(application: Application, db: Session):
    if not application.form_data:
        return
        
    try:
        data = json.loads(application.form_data)
    except json.JSONDecodeError:
        return

    service = db.query(GovernmentService).filter(GovernmentService.id == application.service_id).first()
    if not service:
        return
        
    slug = service.slug

    # Aadhaar Updates
    if slug == "aadhaar-name-update":
        aadhaar = data.get("aadhaar_number")
        new_name = data.get("new_name")
        if aadhaar and new_name:
            record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == aadhaar).first()
            if record:
                record.name = new_name
                
    elif slug == "aadhaar-address-update":
        aadhaar = data.get("aadhaar_number")
        new_address = data.get("new_address")
        if aadhaar and new_address:
            record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == aadhaar).first()
            if record:
                record.address = new_address

    elif slug == "aadhaar-dob-update":
        aadhaar = data.get("aadhaar_number")
        new_dob = data.get("new_dob")
        if aadhaar and new_dob:
            record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == aadhaar).first()
            if record:
                record.dob = new_dob
                
    # PAN Updates
    elif slug == "pan-name-correction":
        pan = data.get("pan_number")
        new_name = data.get("new_name")
        if pan and new_name:
            record = db.query(MockPanRecord).filter(MockPanRecord.pan_number == pan).first()
            if record:
                record.name = new_name

    # Voter ID Updates
    elif slug == "voter-address-update":
        epic = data.get("epic_number")
        new_address = data.get("new_address")
        if epic and new_address:
            record = db.query(MockVoterRecord).filter(MockVoterRecord.epic_number == epic).first()
            if record:
                record.address = new_address

    db.commit()
