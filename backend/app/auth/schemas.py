from pydantic import BaseModel


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    mobile: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    mobile: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class AadhaarOTPRequest(BaseModel):
    aadhaar_number: str

class AadhaarLoginRequest(BaseModel):
    aadhaar_number: str
    otp: str

class AadhaarUserResponse(BaseModel):
    id: int
    aadhaar_number: str
    name: str
    dob: str
    address: str
    gender: str
    mobile: str | None = None
    email: str | None = None

    class Config:
        from_attributes = True
