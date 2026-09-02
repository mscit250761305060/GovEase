from typing import Any

from pydantic import BaseModel


class ApplicationCreateRequest(BaseModel):
    service_id: int
    form_data: dict[str, Any]


class ApplicationDocumentResponse(BaseModel):
    id: int
    document_type: str
    original_filename: str
    verification_status: str

    class Config:
        from_attributes = True

class ApplicationResponse(BaseModel):
    id: int
    application_number: str
    user_id: int
    service_id: int
    status: str
    payment_status: str
    total_fee: float
    documents: list[ApplicationDocumentResponse] = []

    class Config:
        from_attributes = True
