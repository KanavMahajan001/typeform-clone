import re
import secrets

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import load_published_form
from ..models import Answer, Form, FormSession, Response, utcnow
from ..schemas import PublicForm, ResponseCreate, ResponseOut, SessionOut, UploadOut
from ..storage import UPLOAD_DIR, UPLOAD_URL
from ..validation import validate_submission

MAX_UPLOAD_BYTES = 10 * 1024 * 1024

router = APIRouter(prefix="/api/public/forms", tags=["public"])


@router.get("/{public_id}", response_model=PublicForm)
def get_public_form(form: Form = Depends(load_published_form)):
    return form


@router.post("/{public_id}/sessions", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
def start_session(form: Form = Depends(load_published_form), db: Session = Depends(get_db)):
    session = FormSession(form=form)
    db.add(session)
    db.commit()
    return SessionOut(id=session.id)


@router.post("/{public_id}/uploads", response_model=UploadOut, status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile, form: Form = Depends(load_published_form)):
    content = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status.HTTP_413_CONTENT_TOO_LARGE, "Files must be 10 MB or smaller")
    original = re.sub(r"[^A-Za-z0-9._-]+", "-", file.filename or "file").strip("-.") or "file"
    name = f"{secrets.token_hex(8)}-{original}"
    (UPLOAD_DIR / name).write_bytes(content)
    return UploadOut(url=f"{UPLOAD_URL}/{name}", name=original)


@router.post("/{public_id}/responses", response_model=ResponseOut, status_code=status.HTTP_201_CREATED)
def submit_response(
    data: ResponseCreate, form: Form = Depends(load_published_form), db: Session = Depends(get_db)
):
    values, issues = validate_submission(form, data.answers)
    if issues:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, [issue.model_dump() for issue in issues])
    response = Response(form=form, answers=[Answer(question_id=qid, value=value) for qid, value in values.items()])
    db.add(response)
    session = db.get(FormSession, data.session_id) if data.session_id else None
    if session is not None and session.form_id == form.id and session.completed_at is None:
        db.flush()
        session.completed_at = utcnow()
        session.response_id = response.id
    db.commit()
    db.refresh(response)
    return response
