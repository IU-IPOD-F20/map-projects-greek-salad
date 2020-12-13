import csv
import json

from models import *


def quiz_to_csv(quiz: Quiz, filename: str):
    keys = quiz.questions[0].dict().keys()
    rows = [q.dict() for q in quiz.questions]
    with open(filename, "w", newline='') as f:
        w = csv.DictWriter(f, keys)
        w.writeheader()
        w.writerows(rows)


def csv_to_quiz(quiz_id: str, filename: str) -> Quiz:
    with open(filename, "r") as f:
        rawQuestions = [{k: v for k, v in row.items()} for row in csv.DictReader(f, skipinitialspace=True)]
        questions = []
        for q in rawQuestions:
            questions.append(
                SimpleQuestion(question=q['question'], answers=json.loads(q['answers'].replace("\'", "\""))))
        return Quiz(quiz_id=quiz_id, questions=questions)
