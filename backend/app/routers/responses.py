from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..deps import load_form
from ..models import Form, Response
from ..schemas import FormStats, ResponseOut
from ..stats import build_stats

router = APIRouter(prefix="/api/forms/{form_id}", tags=["responses"])


@router.get("/responses", response_model=list[ResponseOut])
def list_responses(form: Form = Depends(load_form), db: Session = Depends(get_db)):
    query = (
        select(Response)
        .where(Response.form_id == form.id)
        .options(selectinload(Response.answers))
        .order_by(Response.submitted_at.desc())
    )
    return db.scalars(query).all()


@router.get("/responses/{response_id}", response_model=ResponseOut)
def get_response(response_id: int, form: Form = Depends(load_form), db: Session = Depends(get_db)):
    response = db.get(Response, response_id)
    if response is None or response.form_id != form.id:
        raise HTTPException(404, "Response not found")
    return response


@router.get("/stats", response_model=FormStats)
def get_stats(form: Form = Depends(load_form)):
    return build_stats(form)
