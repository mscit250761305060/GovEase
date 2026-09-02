from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models.user import User
from app.models.service import GovernmentService
from app.models.application import Application
from app.models.document import ApplicationDocument
from app.models.status_history import ApplicationStatusHistory
from app.models.service_requirement import ServiceRequirement
from app.models.mock_government import MockAadhaarRecord, MockPanRecord, MockVoterRecord, MockDLRecord
from app.models.user_session import UserSession

from app.api.services import router as services_router
from app.auth.routes import router as auth_router
from app.api.applications import router as applications_router
from app.api.verification import router as verification_router
from app.api.admin import router as admin_router
from app.api.aadhaar_services import router as aadhaar_services_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="GovEase API",
    description="Unified Government Digital Services Platform",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(services_router)
app.include_router(auth_router)
app.include_router(applications_router)
app.include_router(verification_router)
app.include_router(admin_router)
app.include_router(aadhaar_services_router)

from fastapi.staticfiles import StaticFiles
import os

# Create storage directory if it doesn't exist
os.makedirs("storage", exist_ok=True)
app.mount("/storage", StaticFiles(directory="storage"), name="storage")


@app.get("/")
def root():
    return {
        "message": "GovEase API is running",
        "status": "success",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected",
    }
