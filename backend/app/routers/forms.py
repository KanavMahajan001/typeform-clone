from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import current_user, load_form
from ..models import Form, Option, Question, User, utcnow
from ..schemas import FormCreate, FormDetail, FormSummary, FormUpdate, QuestionIn, QuestionOut

router = APIRouter(prefix="/api/forms", tags=["forms"])


@router.get("", response_model=list[FormSummary])
def list_forms(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return db.scalars(select(Form).where(Form.owner_id == user.id).order_by(Form.updated_at.desc())).all()


@router.post("", response_model=FormDetail, status_code=status.HTTP_201_CREATED)
def create_form(data: FormCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    form = Form(title=data.title, owner=user)
    db.add(form)
    db.commit()
    db.refresh(form)
    return form


@router.get("/{form_id}", response_model=FormDetail)
def get_form(form: Form = Depends(load_form)):
    return form


@router.patch("/{form_id}", response_model=FormSummary)
def update_form(data: FormUpdate, form: Form = Depends(load_form), db: Session = Depends(get_db)):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(form, field, value)
    db.commit()
    db.refresh(form)
    return form


@router.delete("/{form_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_form(form: Form = Depends(load_form), db: Session = Depends(get_db)):
    db.delete(form)
    db.commit()


@router.post("/{form_id}/duplicate", response_model=FormSummary, status_code=status.HTTP_201_CREATED)
def duplicate_form(form: Form = Depends(load_form), db: Session = Depends(get_db)):
    copy = Form(
        title=f"{form.title} (copy)",
        owner_id=form.owner_id,
        questions=[
            Question(
                type=question.type,
                title=question.title,
                description=question.description,
                required=question.required,
                position=question.position,
                options=[Option(label=option.label, position=option.position) for option in question.options],
            )
            for question in form.questions
        ],
    )
    db.add(copy)
    db.commit()
    db.refresh(copy)
    return copy


@router.put("/{form_id}/questions", response_model=list[QuestionOut])
def replace_questions(items: list[QuestionIn], form: Form = Depends(load_form), db: Session = Depends(get_db)):
    existing = {question.id: question for question in form.questions}
    questions = []
    for position, item in enumerate(items):
        question = existing.get(item.id) or Question()
        question.type = item.type
        question.title = item.title
        question.description = item.description
        question.required = item.required
        question.position = position
        question.options = [Option(label=option.label, position=index) for index, option in enumerate(item.options)]
        questions.append(question)
    form.questions = questions
    form.updated_at = utcnow()
    db.commit()
    db.refresh(form)
    return form.questions
