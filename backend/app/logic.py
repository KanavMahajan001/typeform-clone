from .models import Form, LogicRule, Question, RuleOperator


def matches(rule: LogicRule, value) -> bool:
    if rule.operator == RuleOperator.always:
        return True
    return value is not None and str(value) == rule.value


def path(form: Form, answers: dict[int, object]) -> list[Question]:
    questions = form.questions
    by_id = {question.id: question for question in questions}
    index = {question.id: position for position, question in enumerate(questions)}
    visited: list[Question] = []
    current = questions[0] if questions else None
    while current is not None and current.id not in {question.id for question in visited}:
        visited.append(current)
        rule = next((rule for rule in current.rules if matches(rule, answers.get(current.id))), None)
        if rule is None:
            following = index[current.id] + 1
            current = questions[following] if following < len(questions) else None
        else:
            current = by_id.get(rule.target_question_id) if rule.target_question_id is not None else None
    return visited
