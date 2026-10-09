import random
from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Answer, Form, FormStatus, Option, Question, QuestionType as T, Response, User, utcnow

NAMES = ["Priya Sharma", "Liam Walker", "Sofia Rossi", "Arjun Mehta", "Emma Chen", "Noah Patel", "Mia Johansson", "Lucas Silva"]
FEEDBACK = [
    "Loved how fast the onboarding was.",
    "The mobile app could use a dark mode.",
    "Support replied within minutes, really impressed.",
    "Pricing feels a bit steep for small teams.",
    "Would love more integrations with Notion.",
    "Everything just works. Keep it up!",
]


def question(type_: T, title: str, *, description: str | None = None, required=True, options: list[str] = ()):
    return Question(
        type=type_,
        title=title,
        description=description,
        required=required,
        options=[Option(label=label, position=index) for index, label in enumerate(options)],
    )


def form(title: str, status: FormStatus, questions: list[Question]) -> Form:
    for position, item in enumerate(questions):
        item.position = position
    return Form(title=title, status=status, questions=questions)


def response(form_: Form, values: list[str | None], days_ago: float) -> Response:
    answers = [
        Answer(question_id=q.id, value=value) for q, value in zip(form_.questions, values) if value is not None
    ]
    return Response(form_id=form_.id, answers=answers, submitted_at=utcnow() - timedelta(days=days_ago))


def seed(db: Session) -> None:
    if db.scalar(select(User)) is not None:
        return
    random.seed(7)
    user = User(name="Kanav Mahajan", email="kanav@example.com")
    feedback = form(
        "Customer Feedback Survey",
        FormStatus.published,
        [
            question(T.short_text, "First off, what's your name?"),
            question(T.email, "And your email address?", description="We'll only use it to follow up."),
            question(T.multiple_choice, "How did you hear about us?", options=["Search engine", "Social media", "A friend", "Advertisement"]),
            question(T.rating, "How satisfied are you with our product?"),
            question(T.yes_no, "Would you recommend us to a friend?"),
            question(T.long_text, "Anything else you'd like to share?", required=False),
        ],
    )
    registration = form(
        "Event Registration",
        FormStatus.published,
        [
            question(T.short_text, "What's your full name?"),
            question(T.email, "Which email should we send your ticket to?"),
            question(T.dropdown, "Pick your T-shirt size", options=["XS", "S", "M", "L", "XL"]),
            question(T.number, "How many guests are you bringing?", description="Not counting yourself."),
            question(T.multiple_choice, "Which track interests you most?", options=["Design", "Engineering", "Product", "Growth"]),
            question(T.yes_no, "Do you have any dietary restrictions?", required=False),
        ],
    )
    research = form(
        "Product Research Interview",
        FormStatus.draft,
        [
            question(T.short_text, "What's your role?"),
            question(T.long_text, "Describe the last time you built a form."),
            question(T.rating, "How painful was it?"),
        ],
    )
    user.forms = [feedback, registration, research]
    db.add(user)
    db.flush()

    for index, name in enumerate(NAMES):
        email = name.lower().replace(" ", ".") + "@example.com"
        db.add(
            response(
                feedback,
                [
                    name,
                    email,
                    random.choice(feedback.questions[2].options).label,
                    str(random.randint(3, 5)),
                    random.choice(["Yes", "Yes", "No"]),
                    random.choice(FEEDBACK) if index % 2 == 0 else None,
                ],
                days_ago=index * 1.5 + 0.2,
            )
        )
    for index, name in enumerate(NAMES[:6]):
        email = name.split()[0].lower() + "@example.com"
        db.add(
            response(
                registration,
                [
                    name,
                    email,
                    random.choice(registration.questions[2].options).label,
                    str(random.randint(0, 3)),
                    random.choice(registration.questions[4].options).label,
                    random.choice(["Yes", "No", None]),
                ],
                days_ago=index * 2 + 0.5,
            )
        )
    db.commit()
