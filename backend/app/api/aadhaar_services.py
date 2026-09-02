from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_aadhaar_user
from app.models.mock_government import MockAadhaarRecord, AadhaarUpdateHistory, AadhaarUpdateApplication
import os
import shutil
import uuid

from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/api/aadhaar",
    tags=["Aadhaar Services"],
)

from app.models.service_proof_config import ServiceProofConfig

@router.get("/proof-configs")
async def get_proof_configs(
    service_type: str,
    db: Session = Depends(get_db)
):
    configs = db.query(ServiceProofConfig).filter(
        ServiceProofConfig.service_type == service_type
    ).all()
    return configs

@router.get("/my-record")
async def get_my_aadhaar_record(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get the last updated Aadhaar record for this user session
    history = db.query(AadhaarUpdateHistory).filter(AadhaarUpdateHistory.user_id == current_user.id).order_by(AadhaarUpdateHistory.created_at.desc()).first()
    
    if history:
        record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == history.aadhaar_number).first()
    else:
        record = db.query(MockAadhaarRecord).first() # Fallback demo record if they haven't submitted anything yet
    if not record:
         raise HTTPException(status_code=404, detail="Aadhaar record not found for this user")
         
    return record


@router.post("/process-update")
async def process_aadhaar_update(
    service_type: str = Form(...),
    proof_name: str = Form(...),
    new_value: str = Form(...),
    old_name: str = Form(""),
    dob: str = Form(""),
    mobile: str = Form(""),
    aadhaar_number: str = Form(""),
    document: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not document:
        raise HTTPException(status_code=400, detail="Document proof is required")

    from app.api.verification_agent import verify_document
    is_valid, error_message = verify_document(document, service_type, proof_name, new_value, db)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_message)

    if not aadhaar_number:
        raise HTTPException(status_code=400, detail="Aadhaar number is required")

    aadhaar_record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == aadhaar_number).first()
    
    # Auto-create mock record on the fly so any Aadhaar Number works for the demo!
    if not aadhaar_record:
        aadhaar_record = MockAadhaarRecord(
            aadhaar_number=aadhaar_number,
            name=old_name if old_name else current_user.full_name,
            dob=dob if dob else "01/01/1990",
            address="Demo Address, India",
            gender="Unspecified",
            mobile=mobile if mobile else current_user.mobile
        )
        db.add(aadhaar_record)
        db.commit()
        db.refresh(aadhaar_record)

    # Proceed with instant update since payment was successful (on frontend)
    old_value = None
    if service_type == "name-update":
        old_value = aadhaar_record.name
        aadhaar_record.name = new_value
    elif service_type == "address-update":
        old_value = aadhaar_record.address
        aadhaar_record.address = new_value
    elif service_type == "dob-update":
        old_value = aadhaar_record.dob
        aadhaar_record.dob = new_value
    elif service_type == "gender-update":
        old_value = aadhaar_record.gender
        aadhaar_record.gender = new_value
    elif service_type == "mobile-update":
        old_value = aadhaar_record.mobile
        aadhaar_record.mobile = new_value
    elif service_type == "email-update":
        old_value = aadhaar_record.email
        aadhaar_record.email = new_value
    else:
        raise HTTPException(status_code=400, detail="Invalid service type")

    # Record the update in history
    update_history = AadhaarUpdateHistory(
        user_id=current_user.id,
        aadhaar_number=aadhaar_number,
        service_type=service_type,
        old_value=str(old_value) if old_value else "Not Provided",
        new_value=new_value,
        status="Approved"
    )
    db.add(update_history)
    
    # Save the document to the file system securely
    upload_dir = "storage/aadhaar_proofs"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename to prevent overwriting
    ext = document.filename.split(".")[-1]
    safe_filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(upload_dir, safe_filename)
    
    document.file.seek(0)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(document.file, buffer)
        
    # Store complete application data in the new table
    update_application = AadhaarUpdateApplication(
        user_id=current_user.id,
        aadhaar_number=aadhaar_number,
        old_name=old_name,
        new_name=new_value,
        dob=dob,
        mobile=mobile,
        proof_name=proof_name,
        document_path=file_path,
        status="Approved"
    )
    db.add(update_application)
    
    db.commit()
    db.refresh(aadhaar_record)

    return {
        "status": "success",
        "message": f"Your {service_type.replace('-', ' ')} has been successfully updated in the Aadhaar database.",
        "updated_record": aadhaar_record
    }

@router.get("/my-applications")
async def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = db.query(AadhaarUpdateHistory).filter(
        AadhaarUpdateHistory.user_id == current_user.id
    ).order_by(AadhaarUpdateHistory.created_at.desc()).all()
    
    return history


from pydantic import BaseModel
class SMSRequest(BaseModel):
    message: str

@router.post("/send-sms")
async def send_sms_notification(
    request: SMSRequest,
    current_user: User = Depends(get_current_user)
):
    # In a real app, integrate with Twilio or AWS SNS here
    masked_mobile = "******" + current_user.mobile[-4:] if current_user.mobile else "your registered mobile number"
    return {
        "status": "success",
        "message": f"SMS sent successfully to {masked_mobile}",
        "sms_content": request.message
    }
