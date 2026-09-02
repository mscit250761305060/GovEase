import json
import uuid
import os
import shutil

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.service import GovernmentService
from app.models.user import User
from app.models.document import ApplicationDocument

from app.auth.dependencies import get_current_user

from app.api.application_schemas import (
    ApplicationCreateRequest,
    ApplicationResponse,
)


router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"],
)


def generate_application_number() -> str:
    unique_part = uuid.uuid4().hex[:8].upper()

    return f"GOV-{unique_part}"


@router.post(
    "/",
    response_model=ApplicationResponse,
)
def create_application(
    data: ApplicationCreateRequest,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    service = (
        db.query(GovernmentService)
        .filter(
            GovernmentService.id == data.service_id,
            GovernmentService.is_active == True,
        )
        .first()
    )

    if not service:
        raise HTTPException(
            status_code=404,
            detail="Government service not found",
        )

    application = Application(
        application_number=generate_application_number(),
        user_id=current_user.id,
        service_id=service.id,
        status="submitted",
        payment_status=(
            "pending"
            if service.fee > 0
            else "not_required"
        ),
        total_fee=service.fee,
        form_data=json.dumps(data.form_data),
        verification_result=None,
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


@router.get(
    "/",
    response_model=list[ApplicationResponse],
)
def get_my_applications(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    applications = (
        db.query(Application)
        .filter(
            Application.user_id == current_user.id
        )
        .order_by(
            Application.created_at.desc()
        )
        .all()
    )

    return applications


@router.get(
    "/{application_number}",
    response_model=ApplicationResponse,
)
def get_application(
    application_number: str,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    application = (
        db.query(Application)
        .filter(
            Application.application_number
            == application_number,
            Application.user_id
            == current_user.id,
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return application


@router.post(
    "/{application_number}/documents",
)
def upload_document(
    application_number: str,
    document_type: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    application = (
        db.query(Application)
        .filter(
            Application.application_number == application_number,
            Application.user_id == current_user.id,
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    # Basic file validation
    if not file.filename:
        raise HTTPException(status_code=400, detail="Empty filename")
    
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["pdf", "jpg", "jpeg", "png"]:
        raise HTTPException(status_code=400, detail="Unsupported file extension")

    # Secure storage
    storage_dir = os.path.join("storage", "applications", application_number)
    os.makedirs(storage_dir, exist_ok=True)
    
    file_path = os.path.join(storage_dir, f"{document_type}.{ext}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Database record
    document = ApplicationDocument(
        application_id=application.id,
        document_type=document_type,
        original_filename=file.filename,
        stored_path=file_path,
        verification_status="pending",
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return {"message": "Document uploaded successfully", "document_id": document.id}

@router.post(
    "/{application_number}/pay",
)
def process_payment(
    application_number: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    application = (
        db.query(Application)
        .filter(
            Application.application_number == application_number,
            Application.user_id == current_user.id,
        )
        .first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if application.payment_status != "pending":
        raise HTTPException(status_code=400, detail="Payment not required or already paid")

    # Simulate payment success
    application.payment_status = "completed"
    
    db.commit()
    db.refresh(application)
    
    return {"message": "Payment successful"}
