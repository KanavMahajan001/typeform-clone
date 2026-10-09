from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from .models import FormStatus, QuestionType, RuleOperator

HexColor = Field(pattern=r"^#[0-9a-fA-F]{6}$")


class Theme(BaseModel):
    font: Literal["sans", "serif", "mono"] = "sans"
    question_color: str = Field("#000000", pattern=r"^#[0-9a-fA-F]{6}$")
    answer_color: str = Field("#0445af", pattern=r"^#[0-9a-fA-F]{6}$")
    button_color: str = Field("#0445af", pattern=r"^#[0-9a-fA-F]{6}$")
    background_color: str = Field("#ffffff", pattern=r"^#[0-9a-fA-F]{6}$")


class OptionIn(BaseModel):
    label: str = Field(min_length=1, max_length=255)


class OptionOut(OptionIn):
    model_config = ConfigDict(from_attributes=True)

    id: int


class RuleIn(BaseModel):
    operator: RuleOperator
    value: str | None = Field(default=None, max_length=255)
    target_index: int | None = None


class RuleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    operator: RuleOperator
    value: str | None
    target_question_id: int | None


class QuestionIn(BaseModel):
    id: int | None = None
    type: QuestionType
    title: str = Field(max_length=2000)
    description: str | None = Field(default=None, max_length=2000)
    required: bool = False
    options: list[OptionIn] = []
    rules: list[RuleIn] = []


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: QuestionType
    title: str
    description: str | None
    required: bool
    position: int
    options: list[OptionOut]
    rules: list[RuleOut]


class FormCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)


class FormUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    status: FormStatus | None = None
    theme: Theme | None = None


class FormSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    public_id: str
    title: str
    status: FormStatus
    response_count: int
    starts_count: int
    completed_count: int
    created_at: datetime
    updated_at: datetime


class FormDetail(FormSummary):
    theme: Theme
    questions: list[QuestionOut]


class PublicQuestion(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: QuestionType
    title: str
    description: str | None
    required: bool
    options: list[OptionOut]
    rules: list[RuleOut]


class PublicForm(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    public_id: str
    title: str
    theme: Theme
    questions: list[PublicQuestion]


class SessionOut(BaseModel):
    id: int


class UploadOut(BaseModel):
    url: str
    name: str


class AnswerIn(BaseModel):
    question_id: int
    value: str | int | float | bool | None = None


class ResponseCreate(BaseModel):
    answers: list[AnswerIn]
    session_id: int | None = None


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
    starts: int
    completed: int
    completion_rate: float | None
    questions: list[QuestionStats]
