from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .database import get_db
from .models import Form, FormStatus, User


def current_user(db: Session = Depends(get_db)) -> User:
    user = db.scalar(select(User).order_by(User.id))
    if user is None:
        raise HTTPException(503, "No creator account available")
    return user


def load_form(form_id: int, db: Session = Depends(get_db)) -> Form:
    form = db.get(Form, form_id)
    if form is None:
        raise HTTPException(404, "Form not found")
    return form


def load_published_form(public_id: str, db: Session = Depends(get_db)) -> Form:
    form = db.scalar(select(Form).where(Form.public_id == public_id, Form.status == FormStatus.published))
    if form is None:
        raise HTTPException(404, "This form is not available")
    return form
