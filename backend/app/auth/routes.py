from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.mock_government import MockAadhaarRecord

from app.auth.schemas import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
    TokenResponse,
)

from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
)

from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
):

    existing_email = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    existing_mobile = (
        db.query(User)
        .filter(User.mobile == data.mobile)
        .first()
    )

    if existing_mobile:
        raise HTTPException(
            status_code=400,
            detail="Mobile number already registered",
        )

    user = User(
        full_name=data.full_name,
        email=data.email,
        mobile=data.mobile,
        password_hash=hash_password(data.password),
        role="citizen",
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role,
        },
        expires_delta=timedelta(hours=2),
    )

    from app.models.user_session import UserSession
    from fastapi import Request
    
    # We could get IP and User Agent from Request if we added it to the signature, 
    # but for simplicity we can just leave them null or add dummy values if Request is not available.
    session_record = UserSession(
        user_id=user.id,
        ip_address="127.0.0.1", # In a real app, extract from Request
        user_agent="GovEase Client" # In a real app, extract from Request
    )
    db.add(session_record)
    db.commit()

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
):
    return current_user


from app.auth.dependencies import get_current_aadhaar_user
from app.auth.schemas import AadhaarUserResponse
from app.models.mock_government import MockAadhaarRecord

@router.get("/aadhaar/me", response_model=AadhaarUserResponse)
def get_aadhaar_me(
    current_user: MockAadhaarRecord = Depends(get_current_aadhaar_user),
):
    return current_user


from app.auth.schemas import AadhaarOTPRequest, AadhaarLoginRequest

@router.post("/aadhaar/otp")
def aadhaar_otp(
    data: AadhaarOTPRequest,
    db: Session = Depends(get_db),
):
    clean_aadhaar = data.aadhaar_number.replace(" ", "")
    record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == clean_aadhaar).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aadhaar number not found",
        )
        
    mobile = record.mobile
    if mobile and len(mobile) >= 4:
        masked_mobile = "******" + mobile[-4:]
    else:
        masked_mobile = "your registered mobile number"
        
    # Mock OTP sent
    return {
        "message": f"OTP sent successfully to {masked_mobile}",
        "mock_otp": "123456"
    }


@router.post("/aadhaar/login", response_model=TokenResponse)
def aadhaar_login(
    data: AadhaarLoginRequest,
    db: Session = Depends(get_db),
):
    clean_aadhaar = data.aadhaar_number.replace(" ", "")
    record = db.query(MockAadhaarRecord).filter(MockAadhaarRecord.aadhaar_number == clean_aadhaar).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aadhaar number not found",
        )
        
    if data.otp != "123456":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OTP",
        )
        
    access_token = create_access_token(
        data={
            "sub": str(record.aadhaar_number),
            "role": "aadhaar_user",
        },
        expires_delta=timedelta(hours=2),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
