from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi_users.authentication import CookieAuthentication
from fastapi_users import FastAPIUsers
from user_models import *
from database import Database
from models import *

app = FastAPI(
    title="Quiz Game",
    description="This is a very fancy project, with auto docs for the API and everything",
    version="0.0.1",
)

db = Database()  # Change to https://fastapi.tiangolo.com/tutorial/sql-databases/#main-fastapi-app


@app.get("/",
         description="Check if site working")
def test():
    return {"status": "Hello, slvt!"}


@app.put("/user",
         description="Crate new user for quiz")
def create_user(quiz_id: str, username: str):
    is_ok, error = db.add_user(quiz_id, username)
    if is_ok:
        return JSONResponse(status_code=status.HTTP_201_CREATED)
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": error})


@app.put("/quiz",
         description="Create new quiz")
def create_quiz(quiz: Quiz):
    is_ok, error = db.add_quiz(quiz)
    if is_ok:
        return JSONResponse(status_code=status.HTTP_201_CREATED)
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": error})


@app.get("/quiz",
         description="Get quiz", response_model=List[SimpleQuestion])
def get_quiz(quiz_id: str):
    is_ok, error, quiz = db.get_quiz(quiz_id)
    if is_ok:
        return quiz
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": error})


@app.put("/quiz/{quiz_id}",
         description="Answer on quiz")
def question_answer(quiz_id: str, username: str, answer: str):
    is_ok, error = db.add_answer(quiz_id, username, answer)
    if is_ok:
        return JSONResponse(status_code=status.HTTP_201_CREATED)
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": error})


@app.get("/quiz/{quiz_id}",
         description="Get quiz results", response_model=List[QuizAnswers])
def get_quiz_results(quiz_id: str):
    is_ok, error, answers = db.get_quiz_results(quiz_id)
    if is_ok:
        return answers
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": error})


@app.get("/hard_reset",
         description="Drop full database")
def hard_reset():
    return db.hard_reset()


### REGISTRATION AND LOGIN

@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

SECRET = "VERYBIGSECRET"
cookie_authentication = CookieAuthentication(secret=SECRET, lifetime_seconds=3600)

fastapi_users = FastAPIUsers(
    user_db,
    [cookie_authentication],
    User,
    UserCreate,
    UserUpdate,
    UserDB,
)

app.include_router(
    fastapi_users.get_auth_router(cookie_authentication),
    prefix="/auth/cookie",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(),
    prefix="/auth",
    tags=["auth"],
)
