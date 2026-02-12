from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import create_access_token, verify_password
from app.core.config import settings

router = APIRouter()


@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != settings.API_ADMIN_USERNAME:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    if form_data.password != settings.API_ADMIN_PASSWORD:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": form_data.username}, expires_delta=expires_delta)
    return {"access_token": access_token, "token_type": "bearer"}