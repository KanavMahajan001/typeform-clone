from collections import Counter

from .models import Form, Question, QuestionType
from .schemas import FormStats, QuestionStats
from .validation import RATING_MAX, YES_NO

SAMPLE_SIZE = 5


def _labels(question: Question) -> list[str]:
    if question.type == QuestionType.yes_no:
        return list(YES_NO)
    if question.type == QuestionType.rating:
        return [str(n) for n in range(1, RATING_MAX + 1)]
    return [option.label for option in question.options]


def question_stats(question: Question) -> QuestionStats:
    values = [answer.value for answer in question.answers]
    stats = QuestionStats(question_id=question.id, type=question.type, title=question.title, answered=len(values))
    match question.type:
        case QuestionType.multiple_choice | QuestionType.dropdown | QuestionType.yes_no | QuestionType.rating:
            counts = Counter(values)
            stats.counts = {label: counts.get(label, 0) for label in _labels(question)}
        case _:
            stats.samples = values[-SAMPLE_SIZE:][::-1]
    if question.type in (QuestionType.number, QuestionType.rating) and values:
        stats.average = round(sum(map(float, values)) / len(values), 2)
    return stats


def build_stats(form: Form) -> FormStats:
    return FormStats(responses=form.response_count, questions=[question_stats(q) for q in form.questions])
