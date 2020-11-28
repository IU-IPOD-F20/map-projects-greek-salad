from enum import Enum
from models import *
import pickledb


class DBNames(str, Enum):
    """
    Keys for structures in pickeldb, d_ for dict, l_ for list
    """
    QUIZZES_USERS = "d_quizzes_users"
    QUIZZES_ID = "l_quizzes_id"
    QUIZ_QUESTION = "d_quiz_question"


class Database:
    def __init__(self):
        self.db = pickledb.load('quiz.db', True)
        for dbname in DBNames:
            name = dbname.value
            if not self.db.get(name):
                if name.startswith('l'):
                    self.db.lcreate(name)
                if name.startswith('d'):
                    self.db.dcreate(name)

    def hard_reset(self):
        return self.db.deldb()

    def close(self):
        return self.db.dump()

    def add_user(self, quiz_id: str, username: str):
        if quiz_id not in self.db.lgetall(DBNames.QUIZZES_ID):
            return False, "No such quiz id"
        if self.db.dexists(DBNames.QUIZZES_USERS, quiz_id) and username in self.db.dget(DBNames.QUIZZES_USERS, quiz_id):
            return False, "User already in quiz"
        return self.db.dadd(DBNames.QUIZZES_USERS, (quiz_id, username)), "Error in database"

    def add_quiz(self, quiz: Quiz):
        if quiz.quiz_id in self.db.lgetall(DBNames.QUIZZES_ID):
            return False, "Already have such quiz id"
        is_ok = self.db.ladd(DBNames.QUIZZES_ID, quiz.quiz_id)
        if is_ok:
            is_ok = self.db.dadd(DBNames.QUIZ_QUESTION,
                                 (quiz.quiz_id, [question.dict() for question in quiz.questions]))
            if not is_ok:
                self.db.lpop(DBNames.QUIZZES_ID, self.db.lgetall(DBNames.QUIZZES_ID).index())
        return is_ok, "Error in database"

    def get_quiz(self, quiz_id: int):
        if quiz_id not in self.db.lgetall(DBNames.QUIZZES_ID):
            return False, "No such quiz id", None
        quiz = self.db.dget(DBNames.QUIZ_QUESTION, quiz_id)
        return True, "", quiz
