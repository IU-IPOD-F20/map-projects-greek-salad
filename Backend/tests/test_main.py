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

token = "TOKEN"

test_teacher = {
    "email": "test@test.com",
    "password": "test",
}


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200


def test_login():
    client.post("/auth/register", json=test_teacher,
                headers={"accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"})
    response = client.post("/auth/token/login",
                           data={"username": test_teacher['email'], "password": test_teacher['password']},
                           headers={"Content-Type": "application/x-www-form-urlencoded"})
    global token
    token = f"Bearer {response.json()['access_token']}"
    assert response.status_code == 200


def test_add_quiz():
    response = client.put("/quiz", json=test_quiz, headers={"Authorization": token})
    assert response.status_code == 201


def test_get_quiz():
    response = client.get("/quiz", headers={"Authorization": token})
    assert response.status_code == 200
    assert response.json() == [test_quiz]


def test_get_quiz_by_id():
    response = client.get("/quiz/-1")
    assert response.status_code == 200
    assert response.json() == test_quiz


def test_add_user():
    response = client.put("/user", params={"quiz_id": "-1", "username": "test"})
    assert response.status_code == 201


def test_add_answer():
    response = client.put("/quiz/-1", params={"quiz_id": "-1", "username": "test", "answer": "Test"})
    assert response.status_code == 201


def test_get_results():
    response = client.get("/quiz/-1/results")
    assert response.status_code == 200
    assert "test" in [res["username"] for res in response.json()]
