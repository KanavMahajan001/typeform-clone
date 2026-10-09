import csv
import io
import re

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import current_user, load_form
from ..models import Form, LogicRule, Option, Question, User, utcnow
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
    copies = {
        question.id: Question(
            type=question.type,
            title=question.title,
            description=question.description,
            required=question.required,
            position=question.position,
            options=[Option(label=option.label, position=option.position) for option in question.options],
        )
        for question in form.questions
    }
    copy = Form(title=f"{form.title} (copy)", owner_id=form.owner_id, theme=form.theme, questions=list(copies.values()))
    db.add(copy)
    db.flush()
    for question in form.questions:
        copies[question.id].rules = [
            LogicRule(
                operator=rule.operator,
                value=rule.value,
                position=rule.position,
                target_question_id=copies[rule.target_question_id].id if rule.target_question_id in copies else None,
            )
            for rule in question.rules
        ]
    db.commit()
    db.refresh(copy)
    return copy


@router.put("/{form_id}/questions", response_model=list[QuestionOut])
def replace_questions(items: list[QuestionIn], form: Form = Depends(load_form), db: Session = Depends(get_db)):
    for item in items:
        for rule in item.rules:
            if rule.target_index is not None and not 0 <= rule.target_index < len(items):
                raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "Logic rule points to a missing question")
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
    db.flush()
    for question, item in zip(questions, items):
        question.rules = [
            LogicRule(
                operator=rule.operator,
                value=rule.value,
                position=index,
                target_question_id=questions[rule.target_index].id if rule.target_index is not None else None,
            )
            for index, rule in enumerate(item.rules)
        ]
    form.updated_at = utcnow()
    db.commit()
    db.refresh(form)
    return form.questions


@router.get("/{form_id}/responses.csv")
def export_responses(form: Form = Depends(load_form)):
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Submitted at", *(question.title for question in form.questions)])
    for response in sorted(form.responses, key=lambda item: item.submitted_at, reverse=True):
        answers = {answer.question_id: answer.value for answer in response.answers}
        writer.writerow([response.submitted_at.isoformat(), *(answers.get(question.id, "") for question in form.questions)])
    filename = re.sub(r"[^A-Za-z0-9]+", "-", form.title).strip("-").lower() or "responses"
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}-responses.csv"'},
    )
