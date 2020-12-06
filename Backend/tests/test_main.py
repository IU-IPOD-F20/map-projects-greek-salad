from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

test_quiz = {
    "quiz_id": "-1",
    "questions": [
        {
            "question": "Test test?",
            "answers": {
                "Test": 1,
                "test": 0,
                "not test": -1
            }
        }
    ]
}


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200


def test_add_quiz():
    response = client.put("/quiz", json=test_quiz)
    assert response.status_code == 201


def test_get_quiz():
    response = client.get("/quiz", params={"quiz_id": "-1"})
    assert response.status_code == 200
    assert response.json() == test_quiz['questions']


def test_add_user():
    response = client.put("/user", params={"quiz_id": "-1", "username": "test"})
    assert response.status_code == 201


def test_add_answer():
    response = client.put("/quiz/-1", params={"quiz_id": "-1", "username": "test", "answer": "Test"})
    assert response.status_code == 201


def test_get_results():
    response = client.get("/quiz/-1")
    assert response.status_code == 200
    assert "test" in [res["username"] for res in response.json()]