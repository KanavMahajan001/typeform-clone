import os

os.environ["DATABASE_URL"] = "sqlite://"

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="module")
def published(client):
    forms = client.get("/api/forms").json()
    return next(form for form in forms if form["title"] == "Customer Feedback Survey")


def test_seed_creates_forms_with_responses(client):
    forms = client.get("/api/forms").json()
    assert len(forms) == 3
    assert sum(form["response_count"] for form in forms) == 14


def test_form_lifecycle(client):
    form = client.post("/api/forms", json={"title": "Lifecycle"}).json()
    assert form["status"] == "draft" and form["questions"] == []

    saved = client.put(
        f"/api/forms/{form['id']}/questions",
        json=[
            {"type": "short_text", "title": "Name", "required": True},
            {"type": "dropdown", "title": "Size", "options": [{"label": "S"}, {"label": "M"}]},
        ],
    ).json()
    assert [question["position"] for question in saved] == [0, 1]
    assert [option["label"] for option in saved[1]["options"]] == ["S", "M"]

    reordered = client.put(
        f"/api/forms/{form['id']}/questions",
        json=[{"id": saved[1]["id"], "type": "dropdown", "title": "Size", "options": [{"label": "M"}]}, {"type": "rating", "title": "Rate"}],
    ).json()
    assert reordered[0]["id"] == saved[1]["id"] and reordered[0]["position"] == 0
    assert reordered[1]["type"] == "rating"

    assert client.patch(f"/api/forms/{form['id']}", json={"title": "Renamed", "status": "published"}).json()["title"] == "Renamed"
    copy = client.post(f"/api/forms/{form['id']}/duplicate").json()
    assert copy["title"] == "Renamed (copy)" and copy["status"] == "draft"
    assert len(client.get(f"/api/forms/{copy['id']}").json()["questions"]) == 2

    assert client.delete(f"/api/forms/{copy['id']}").status_code == 204
    assert client.get(f"/api/forms/{copy['id']}").status_code == 404


def test_public_form_requires_published_status(client):
    draft = next(form for form in client.get("/api/forms").json() if form["status"] == "draft")
    assert client.get(f"/api/public/forms/{draft['public_id']}").status_code == 404
    assert client.get("/api/public/forms/missing00").status_code == 404


def test_submission_is_validated(client, published):
    questions = client.get(f"/api/public/forms/{published['public_id']}").json()["questions"]
    email = next(question for question in questions if question["type"] == "email")
    response = client.post(
        f"/api/public/forms/{published['public_id']}/responses",
        json={"answers": [{"question_id": email["id"], "value": "not-an-email"}]},
    )
    assert response.status_code == 422
    messages = {issue["question_id"]: issue["message"] for issue in response.json()["detail"]}
    assert messages[email["id"]] == "Hmm... that email doesn't look right"
    assert all(question["id"] in messages for question in questions if question["required"] and question["id"] != email["id"])


def test_submission_is_stored_and_summarised(client, published):
    questions = client.get(f"/api/public/forms/{published['public_id']}").json()["questions"]
    answers = []
    for question in questions:
        value = {
            "short_text": "Sam",
            "long_text": "All good",
            "email": "sam@example.com",
            "number": 2,
            "rating": 5,
            "yes_no": True,
        }.get(question["type"]) or question["options"][0]["label"]
        answers.append({"question_id": question["id"], "value": value})

    before = client.get(f"/api/forms/{published['id']}").json()["response_count"]
    response = client.post(f"/api/public/forms/{published['public_id']}/responses", json={"answers": answers})
    assert response.status_code == 201
    stored = {answer["question_id"]: answer["value"] for answer in response.json()["answers"]}
    assert all(isinstance(value, str) for value in stored.values())

    assert client.get(f"/api/forms/{published['id']}").json()["response_count"] == before + 1
    stats = client.get(f"/api/forms/{published['id']}/stats").json()
    assert stats["responses"] == before + 1
    rating = next(item for item in stats["questions"] if item["type"] == "rating")
    assert rating["counts"]["5"] >= 1 and rating["average"] is not None
