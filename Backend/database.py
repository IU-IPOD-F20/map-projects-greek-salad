from enum import Enum
import pickledb


class DBNames(str, Enum):
    QUIZZES_USERS = "quizzes_users"
    QUIZZES = "quizzes"


class Database:

    def __init__(self):
        self.db = pickledb.load('quiz.db', True)
        if not self.db.get(DBNames.QUIZZES_USERS):
            self.db.dcreate(DBNames.QUIZZES_USERS)
        if not self.db.get(DBNames.QUIZZES):
            self.db.lcreate(DBNames.QUIZZES)

    def close(self):
        self.db.dump()

    def add_user(self, quiz_id, username):
        if quiz_id not in self.db.lgetall(DBNames.QUIZZES):
            return False, "No such quiz id"
        if self.db.dexists(DBNames.QUIZZES_USERS, quiz_id) and username in self.db.dget(DBNames.QUIZZES_USERS, quiz_id):
            return False, "User already in quiz"
        return self.db.dadd(DBNames.QUIZZES_USERS, (quiz_id, username)), "Error in database"

    def add_quiz(self, quiz_id):
        if quiz_id in self.db.lgetall(DBNames.QUIZZES):
            return False, "Already have such quiz id"
        return self.db.ladd(DBNames.QUIZZES, quiz_id), "Error in database"
