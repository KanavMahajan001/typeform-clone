import re

from .logic import path
from .models import Form, Question, QuestionType
from .schemas import AnswerIn, ValidationIssue

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
RATING_MAX = 5
YES_NO = ("Yes", "No")
UPLOAD_PREFIX = "/api/uploads/"


class AnswerError(ValueError):
    pass


def _text(_: Question, value) -> str:
    return str(value).strip()


def _email(_: Question, value) -> str:
    value = str(value).strip()
    if not EMAIL_RE.match(value):
        raise AnswerError("Hmm... that email doesn't look right")
    return value


def _number(_: Question, value) -> str:
    try:
        number = float(value)
    except (TypeError, ValueError):
        raise AnswerError("Please enter a valid number")
    return str(int(number)) if number.is_integer() else str(number)


def _choice(question: Question, value) -> str:
    value = str(value)
    if value not in {option.label for option in question.options}:
        raise AnswerError("Please select one of the options")
    return value


def _yes_no(_: Question, value) -> str:
    if isinstance(value, bool):
        return YES_NO[0] if value else YES_NO[1]
    text = str(value).strip().capitalize()
    if text not in YES_NO:
        raise AnswerError("Please choose Yes or No")
    return text


def _rating(_: Question, value) -> str:
    try:
        rating = int(value)
    except (TypeError, ValueError):
        raise AnswerError("Please pick a rating")
    if not 1 <= rating <= RATING_MAX:
        raise AnswerError(f"Please pick a rating from 1 to {RATING_MAX}")
    return str(rating)


def _file(_: Question, value) -> str:
    value = str(value)
    if not value.startswith(UPLOAD_PREFIX) or "/" in value[len(UPLOAD_PREFIX):]:
        raise AnswerError("Please upload a file")
    return value


NORMALIZERS = {
    QuestionType.short_text: _text,
    QuestionType.long_text: _text,
    QuestionType.multiple_choice: _choice,
    QuestionType.dropdown: _choice,
    QuestionType.email: _email,
    QuestionType.number: _number,
    QuestionType.yes_no: _yes_no,
    QuestionType.rating: _rating,
    QuestionType.file_upload: _file,
}


def normalize_answer(question: Question, value) -> str | None:
    if value is None or (isinstance(value, str) and not value.strip()):
        if question.required:
            raise AnswerError("Please fill this in")
        return None
    return NORMALIZERS[question.type](question, value)


def validate_submission(form: Form, answers: list[AnswerIn]) -> tuple[dict[int, str], list[ValidationIssue]]:
    given = {answer.question_id: answer.value for answer in answers}
    values: dict[int, str] = {}
    issues: list[ValidationIssue] = []
    for question in path(form, given):
        try:
            value = normalize_answer(question, given.get(question.id))
        except AnswerError as error:
            issues.append(ValidationIssue(question_id=question.id, message=str(error)))
            continue
        if value is not None:
            values[question.id] = value
    return values, issues
