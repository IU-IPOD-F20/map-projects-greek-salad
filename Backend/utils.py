import csv

from models import Quiz


def quiz_to_csv(quiz: Quiz, filename: str):
    keys = quiz.questions[0].dict().keys()
    rows = [q.dict() for q in quiz.questions]
    with open(filename, "w", newline='') as f:
        w = csv.DictWriter(f, keys)
        w.writeheader()
        w.writerows(rows)


def csv_to_quiz():
    pass
