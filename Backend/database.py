from enum import Enum
from models import *
from typing import *
import pickledb


class DBNames(str, Enum):
    """
    Keys for structures in pickeldb, d_ for dict, l_ for list
    """
    QUIZZES_USERS = "d_quizzes_users"
    QUIZZES_ID = "l_quizzes_id"
    QUIZ_QUESTION = "d_quiz_question"
    USER_ANSWERS = "d_user_answers"
    TEACHER_QUIZZES = "d_quizzes_teacher"


class Database:
    def __init__(self, name: str):
        self.db = pickledb.load(f'{name}.db', True)
        for dbname in DBNames:
            name = dbname.value
            if not self.db.get(name):
                if name.startswith('l'):
                    self.db.lcreate(name)
                if name.startswith('d'):
                    self.db.dcreate(name)

    def hard_reset(self) -> bool:
        is_ok = self.db.deldb()
        if is_ok:
            for dbname in DBNames:
                name = dbname.value
                if not self.db.get(name):
                    if name.startswith('l'):
                        self.db.lcreate(name)
                    if name.startswith('d'):
                        self.db.dcreate(name)
        return is_ok

    def close(self) -> bool:
        return self.db.dump()

    def add_user(self, quiz_id: str, username: str) -> Tuple[bool, str]:
        if quiz_id not in self.db.lgetall(DBNames.QUIZZES_ID):
            return False, "No such quiz id"
        usernames = []
        if self.db.dexists(DBNames.QUIZZES_USERS, quiz_id):
            usernames += self.db.dget(DBNames.QUIZZES_USERS, quiz_id)
            if username in usernames:
                if quiz_id == "-1":
                    return True, ""
                return False, "User already in quiz"
        usernames.append(username)
        return self.db.dadd(DBNames.QUIZZES_USERS, (quiz_id, usernames)), "Error in database"

    def add_quiz(self, quiz: Quiz, user_id: str) -> Tuple[bool, str]:
        if quiz.quiz_id in self.db.lgetall(DBNames.QUIZZES_ID):
            if quiz.quiz_id == "-1":
                return True, ""
            return False, "Already have such quiz id"
        is_ok = self.db.ladd(DBNames.QUIZZES_ID, quiz.quiz_id)
        quizzes = []
        if self.db.dexists(DBNames.TEACHER_QUIZZES, user_id):
            quizzes += self.db.dget(DBNames.TEACHER_QUIZZES, user_id)
        quizzes.append(quiz.quiz_id)
        is_ok &= self.db.dadd(DBNames.TEACHER_QUIZZES, (user_id, quizzes))
        is_ok &= self.db.dadd(DBNames.QUIZ_QUESTION, (quiz.quiz_id, [question.dict() for question in quiz.questions]))
        return is_ok, "Error in database"

    def get_quiz(self, user_id: str) -> Tuple[bool, str, List[Quiz]]:
        if not self.db.dexists(DBNames.TEACHER_QUIZZES, user_id):
            return True, "", []
        quizzes = []
        for quiz_id in self.db.dget(DBNames.TEACHER_QUIZZES, user_id):
            is_ok, error, quiz = self.get_quiz_by_id(quiz_id)
            if is_ok:
                quizzes.append(quiz)
        return True, "", quizzes

    def get_quiz_by_id(self, quiz_id: str) -> Tuple[bool, str, Quiz]:
        if quiz_id not in self.db.lgetall(DBNames.QUIZZES_ID):
            return False, "No such quiz id", Quiz()
        quiz = self.db.dget(DBNames.QUIZ_QUESTION, quiz_id)
        return True, "", Quiz(quiz_id=quiz_id, questions=quiz)

    def add_answer(self, quiz_id: str, username: str, answer: str) -> Tuple[bool, str]:
        if username not in self.db.dget(DBNames.QUIZZES_USERS, quiz_id):
            return False, "User not in quiz"
        answers = []
        if username in self.db.dgetall(DBNames.USER_ANSWERS):
            answers += self.db.dget(DBNames.USER_ANSWERS, username)
            if answer in answers and quiz_id == "-1":
                return True, ""
        answers.append(answer)
        return self.db.dadd(DBNames.USER_ANSWERS, (username, answers)), "Error in database"

    def get_quiz_results(self, quiz_id: str) -> Tuple[bool, str, List[QuizAnswers]]:
        if quiz_id not in self.db.lgetall(DBNames.QUIZZES_ID):
            return False, "No such quiz id", []
        questions = self.db.dget(DBNames.QUIZ_QUESTION, quiz_id)
        usernames = self.db.dgetall(DBNames.USER_ANSWERS)
        users_answers = []
        for username in usernames:
            score = 0
            user_answers = []
            answers = self.db.dget(DBNames.USER_ANSWERS, username)
            for index, answer in enumerate(answers):
                answers = questions[index]['answers']
                is_true = answer in answers and answers[answer] > 0
                user_answers.append((answer, is_true))
                score += answers[answer] if answer in answers else 0
            users_answers.append(QuizAnswers(username=username, score=score, answers=user_answers))
        return True, "", users_answers
