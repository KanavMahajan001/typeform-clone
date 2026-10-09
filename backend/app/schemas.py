from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from .models import FormStatus, QuestionType


class OptionIn(BaseModel):
    label: str = Field(min_length=1, max_length=255)


class OptionOut(OptionIn):
    model_config = ConfigDict(from_attributes=True)

    id: int


class QuestionIn(BaseModel):
    id: int | None = None
    type: QuestionType
    title: str = Field(max_length=2000)
    description: str | None = Field(default=None, max_length=2000)
    required: bool = False
    options: list[OptionIn] = []


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: QuestionType
    title: str
    description: str | None
    required: bool
    position: int
    options: list[OptionOut]


class FormCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)


class FormUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    status: FormStatus | None = None


class FormSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    public_id: str
    title: str
    status: FormStatus
    response_count: int
    created_at: datetime
    updated_at: datetime


class FormDetail(FormSummary):
    questions: list[QuestionOut]


class PublicQuestion(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: QuestionType
    title: str
    description: str | None
    required: bool
    options: list[OptionOut]


class PublicForm(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    public_id: str
    title: str
    questions: list[PublicQuestion]


class AnswerIn(BaseModel):
    question_id: int
    value: str | int | float | bool | None = None


class ResponseCreate(BaseModel):
    answers: list[AnswerIn]


class AnswerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    question_id: int
    value: str


class ResponseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    submitted_at: datetime
    answers: list[AnswerOut]


class ValidationIssue(BaseModel):
    question_id: int
    message: str


class QuestionStats(BaseModel):
    question_id: int
    type: QuestionType
    title: str
    answered: int
    counts: dict[str, int] | None = None
    average: float | None = None
    samples: list[str] | None = None


class FormStats(BaseModel):
    responses: int
    questions: list[QuestionStats]
