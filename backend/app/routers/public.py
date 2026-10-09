from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import load_published_form
from ..models import Answer, Form, Response
from ..schemas import PublicForm, ResponseCreate, ResponseOut
from ..validation import validate_submission

router = APIRouter(prefix="/api/public/forms", tags=["public"])


@router.get("/{public_id}", response_model=PublicForm)
def get_public_form(form: Form = Depends(load_published_form)):
    return form


@router.post("/{public_id}/responses", response_model=ResponseOut, status_code=status.HTTP_201_CREATED)
def submit_response(
    data: ResponseCreate, form: Form = Depends(load_published_form), db: Session = Depends(get_db)
):
    values, issues = validate_submission(form, data.answers)
    if issues:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, [issue.model_dump() for issue in issues])
    response = Response(form=form, answers=[Answer(question_id=qid, value=value) for qid, value in values.items()])
    db.add(response)
    db.commit()
    db.refresh(response)
    return response
