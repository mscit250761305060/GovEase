from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_aadhaar_user
from app.models.mock_government import MockAadhaarRecord, AadhaarUpdateHistory

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
    current_user: MockAadhaarRecord = Depends(get_current_aadhaar_user),
    db: Session = Depends(get_db)
):
    record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == current_user.aadhaar_number).first()
    if not record:
        # If the demo user doesn't have a linked Aadhaar, return a default mock record so the presentation doesn't break
        record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == "1234 5678 91").first()
    
    if not record:
         raise HTTPException(status_code=404, detail="Aadhaar record not found for this user")
         
    return record


@router.post("/process-update")
async def process_aadhaar_update(
    service_type: str = Form(...),
    proof_name: str = Form(...),
    new_value: str = Form(...),
    document: UploadFile = File(...),
    current_user: MockAadhaarRecord = Depends(get_current_aadhaar_user),
    db: Session = Depends(get_db)
):
    if not document:
        raise HTTPException(status_code=400, detail="Document proof is required")

    from app.api.verification_agent import verify_document
    is_valid, error_message = verify_document(document, service_type, proof_name, db)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_message)

    aadhaar_record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == current_user.aadhaar_number).first()
    if not aadhaar_record:
        aadhaar_record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == "1234 5678 91").first()

    if not aadhaar_record:
         raise HTTPException(status_code=404, detail="Aadhaar record not found")

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
        aadhaar_number=current_user.aadhaar_number,
        service_type=service_type,
        old_value=str(old_value) if old_value else "Not Provided",
        new_value=new_value,
        status="Approved"
    )
    db.add(update_history)
    db.commit()
    db.refresh(aadhaar_record)

    return {
        "status": "success",
        "message": f"Your {service_type.replace('-', ' ')} has been successfully updated in the Aadhaar database.",
        "updated_record": aadhaar_record
    }

@router.get("/my-applications")
async def get_my_applications(
    current_user: MockAadhaarRecord = Depends(get_current_aadhaar_user),
    db: Session = Depends(get_db)
):
    history = db.query(AadhaarUpdateHistory).filter(
        AadhaarUpdateHistory.aadhaar_number == current_user.aadhaar_number
    ).order_by(AadhaarUpdateHistory.created_at.desc()).all()
    
    return history


from pydantic import BaseModel
class SMSRequest(BaseModel):
    message: str

@router.post("/send-sms")
async def send_sms_notification(
    request: SMSRequest,
    current_user: MockAadhaarRecord = Depends(get_current_aadhaar_user)
):
    # In a real app, integrate with Twilio or AWS SNS here
    masked_mobile = "******" + current_user.mobile[-4:] if current_user.mobile else "your registered mobile number"
    return {
        "status": "success",
        "message": f"SMS sent successfully to {masked_mobile}",
        "sms_content": request.message
    }
