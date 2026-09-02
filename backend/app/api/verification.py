import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.user import User
from app.models.mock_government import MockAadhaarRecord
from app.auth.dependencies import get_current_user
from app.api.application_schemas import ApplicationResponse

router = APIRouter(
    prefix="/api/verification",
    tags=["Verification"],
)

@router.post("/{application_number}", response_model=ApplicationResponse)
def verify_application(
    application_number: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    application = (
        db.query(Application)
        .filter(
            Application.application_number == application_number,
        )
        .first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    if application.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    form_data = json.loads(application.form_data or "{}")
    
    # Simple Mock OCR & Verification Engine
    # 1. Government Database Verification
    aadhaar_number = form_data.get("aadhaar_number")
    
    gov_record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == aadhaar_number).first()
    if not gov_record:
        application.verification_result = json.dumps({"status": "failed", "reason": "Aadhaar number not found in government database."})
        db.commit()
        raise HTTPException(status_code=400, detail="Aadhaar number not found in government database.")
        
    old_name = form_data.get("old_name", "")
    if old_name.lower() != gov_record.name.lower():
        application.verification_result = json.dumps({"status": "failed", "reason": "Current name does not match government records."})
        db.commit()
        raise HTTPException(status_code=400, detail="Current name does not match government records.")

    # 2. Document Verification (Mock OCR)
    documents = application.documents
    if not documents:
        application.verification_result = json.dumps({"status": "failed", "reason": "Required documents are missing."})
        db.commit()
        raise HTTPException(status_code=400, detail="Required documents are missing.")
        
    for doc in documents:
        doc.verification_status = "verified"
        
    # All checks passed
    application.verification_result = json.dumps({
        "status": "passed",
        "gov_record_match": True,
        "ocr_match": True
    })
    application.status = "processing"
    
    db.commit()
    db.refresh(application)

    return application
