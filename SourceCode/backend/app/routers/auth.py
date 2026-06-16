from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest

from app.schemas.auth import LoginRequest
from app.security import create_access_token

from app.auth import get_current_user
from app.models.health_profile import HealthProfile

import bcrypt

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/register")
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = bcrypt.hashpw(
        payload.password.encode(),
        bcrypt.gensalt()
    ).decode()

    user = User(
        email=payload.email,
        password_hash=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "message": "Register success"
    }

@router.post("/login")
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    password_match = bcrypt.checkpw(
        payload.password.encode(),
        user.password_hash.encode()
    )

    if not password_match:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "user_id": user.id,
            "email": user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
def me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    profile = (
        db.query(HealthProfile)
        .filter(
            HealthProfile.user_id == current_user.id
        )
        .first()
    )

    return {
        "id": current_user.id,
        "email": current_user.email,
        "profile_completed":
            profile.profile_completed
            if profile
            else False
    }