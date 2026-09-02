from datetime import datetime
from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class MockAadhaarRecord(Base):
    __tablename__ = "mock_aadhaar_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    aadhaar_number: Mapped[str] = mapped_column(String(12), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    dob: Mapped[str] = mapped_column(String(20), nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    mobile: Mapped[str] = mapped_column(String(15), nullable=True)
    email: Mapped[str] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

class MockPanRecord(Base):
    __tablename__ = "mock_pan_records"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    pan_number: Mapped[str] = mapped_column(String(10), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    dob: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

class MockVoterRecord(Base):
    __tablename__ = "mock_voter_records"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    epic_number: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

class MockDLRecord(Base):
    __tablename__ = "mock_dl_records"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    dl_number: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    valid_till: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

class AadhaarUpdateHistory(Base):
    __tablename__ = "aadhaar_update_history"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=True, index=True)
    aadhaar_number: Mapped[str] = mapped_column(String(12), nullable=False, index=True)
    service_type: Mapped[str] = mapped_column(String(50), nullable=False)
    old_value: Mapped[str] = mapped_column(String(255), nullable=True)
    new_value: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Approved")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

class AadhaarUpdateApplication(Base):
    __tablename__ = "aadhaar_update_applications"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=True, index=True)
    aadhaar_number: Mapped[str] = mapped_column(String(12), nullable=False, index=True)
    old_name: Mapped[str] = mapped_column(String(100), nullable=False)
    new_name: Mapped[str] = mapped_column(String(100), nullable=False)
    dob: Mapped[str] = mapped_column(String(20), nullable=False)
    mobile: Mapped[str] = mapped_column(String(15), nullable=False)
    proof_name: Mapped[str] = mapped_column(String(200), nullable=False)
    document_path: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Approved")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
