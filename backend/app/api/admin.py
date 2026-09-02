from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.user import User
from app.auth.dependencies import get_current_user
from app.api.application_schemas import ApplicationResponse
from app.services.mock_gov_sync import sync_document_update

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)

def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/applications", response_model=list[ApplicationResponse])
def get_all_applications(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    applications = db.query(Application).order_by(Application.created_at.desc()).all()
    return applications

@router.post("/applications/{application_number}/status")
def update_application_status(
    application_number: str,
    status: str,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    application = db.query(Application).filter(Application.application_number == application_number).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    application.status = status
    
    if status == "approved":
        sync_document_update(application, db)
        
    db.commit()
    db.refresh(application)
    return {"message": "Status updated successfully", "status": status}
