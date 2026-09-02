import os
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.service_proof_config import ServiceProofConfig
from google import genai
from pydantic import BaseModel

class VerificationResult(BaseModel):
    is_valid: bool
    error_message: str

def verify_document(document: UploadFile, service_type: str, proof_name: str, new_value: str, db: Session) -> tuple[bool, str]:
    """
    Uses Google Gemini Vision to verify an uploaded document against the expected proof type and new value.
    Returns a tuple of (is_valid, error_message).
    """
    # 1. Fetch the required proof configuration from the database
    config = db.query(ServiceProofConfig).filter(
        ServiceProofConfig.service_type == service_type,
        ServiceProofConfig.proof_name == proof_name
    ).first()
    
    if not config:
        return False, f"No proof configuration found for service type: {service_type} and proof: {proof_name}"

    # 2. Setup Gemini API Client
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        return False, "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file."

    client = genai.Client(api_key=api_key)

    # 3. Read document bytes
    document.file.seek(0)
    image_bytes = document.file.read()
    
    # Reset file pointer in case it's needed elsewhere
    document.file.seek(0)
    
    mime_type = document.content_type
    if not mime_type:
        # Simple fallback based on extension
        ext = document.filename.split(".")[-1].lower()
        mime_type = f"image/{ext}" if ext in ["jpg", "jpeg", "png"] else "application/pdf"

    # 4. Construct Prompt
    prompt = f"""
You are a highly accurate Government Document Verification Agent.
Your task is to analyze the uploaded document and verify it strictly against the user's requirements.

Requirements:
1. Document Type Check: Verify that this document is indeed a valid '{proof_name}'.
2. Content Check: The user is applying for a '{service_type}' and wants to change their details to: '{new_value}'.
   - You MUST scan the document and verify that the exact name/value '{new_value}' is present on the document in the relevant field.
   - For example, if it's a name change to 'Zeel Maheshbhai Khokhneshiya', that exact name must be printed on the document. If the document has a different name, fail the verification.

Special Rules:
- If the document type is 'Birth Certificate': You MUST verify that all required fields are printed in BOTH English and Gujarati. If any required field is missing either language, fail the verification.

If all requirements match perfectly, return is_valid: true and an empty error_message.
If any requirement fails, return is_valid: false and a clear, descriptive error_message explaining why it failed (e.g., 'The name on the document does not match the requested new name', or 'The birth certificate is missing required Gujarati fields.').
"""

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                genai.types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type
                ),
                prompt,
            ],
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=VerificationResult,
                temperature=0.0
            ),
        )
        
        # 5. Parse output
        result = response.parsed
        return result.is_valid, result.error_message
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return False, f"An error occurred during AI verification: {str(e)}"
