import os
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.service_proof_config import ServiceProofConfig

def verify_document(document: UploadFile, service_type: str, proof_name: str, db: Session) -> tuple[bool, str]:
    """
    Simulates an intelligent agent that verifies an uploaded document against the expected proof type.
    Returns a tuple of (is_valid, error_message).
    """
    # 1. Fetch the required proof configuration from the database
    config = db.query(ServiceProofConfig).filter(
        ServiceProofConfig.service_type == service_type,
        ServiceProofConfig.proof_name == proof_name
    ).first()
    
    if not config:
        # If no config is found, we assume no special verification is needed, or we could reject it.
        # For safety, let's reject it if we don't know what to verify against.
        return False, f"No proof configuration found for service type: {service_type} and proof: {proof_name}"
    
    # 2. Extract required keywords
    required_keywords = [kw.strip().lower() for kw in config.required_keywords.split(",")]
    
    # 3. Simulate OCR / AI Verification
    # In a real system, we would pass the document to an LLM or OCR engine.
    # For this demo, we simulate the agent's check by verifying if the uploaded filename
    # contains at least one of the required keywords.
    filename = document.filename.lower()
    
    # Let's say if it contains any of the required keywords, it passes.
    # Or, to be stricter, it must contain all of them. Let's require at least one for flexibility.
    has_keyword = any(kw in filename for kw in required_keywords)
    
    if not has_keyword:
        return False, f"The uploaded document does not appear to be a valid {config.proof_name}. Please upload the correct document."
    
    # 4. Simulate format/design comparison against reference image
    if config.reference_image_path:
        if proof_name.lower() == "birth certificate":
            # Birth certificates don't require strict design layout match, but need English fields
            if "missing_english" in filename:
                return False, "The birth certificate must have all required fields available in English."
        else:
            # If the filename contains 'invalid_format', simulate a mismatch in design layout
            if "invalid_format" in filename:
                return False, "The proof format is not valid. Please upload a valid proof."
            
    return True, "Document successfully verified."
