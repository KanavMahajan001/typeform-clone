from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import hash_password, new_token, verify_password
from ..database import get_db
from ..deps import current_token, current_user
from ..models import AuthToken, User
from ..schemas import AuthOut, LoginIn, SignupIn, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])


def issue(user: User, db: Session) -> AuthOut:
    token = AuthToken(user=user, token=new_token())
    db.add(token)
    db.commit()
    return AuthOut(token=token.token, user=UserOut.model_validate(user))


@router.post("/signup", response_model=AuthOut, status_code=status.HTTP_201_CREATED)
def signup(data: SignupIn, db: Session = Depends(get_db)):
    email = data.email.lower()
    if db.scalar(select(User).where(User.email == email)) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")
    user = User(name=data.name.strip(), email=email, password_hash=hash_password(data.password))
    db.add(user)
    db.flush()
    return issue(user, db)


@router.post("/login", response_model=AuthOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == data.email.lower()))
    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong email or password")
    return issue(user, db)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(current_user)):
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(token: AuthToken = Depends(current_token), db: Session = Depends(get_db)):
    db.delete(token)
    db.commit()
