from fastapi import FastAPI, status, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import JWTAuthentication

import utils
from database import Database
from models import *
from user_models import *

app = FastAPI(
    title="Quiz Game",
    description="This is a very fancy project, with auto docs for the API and everything",
    version="0.0.1",
)

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET = "VERYBIGSECRET"
jwt_authentication = JWTAuthentication(secret=SECRET, lifetime_seconds=3600)

fastapi_users = FastAPIUsers(
    user_db,
    [jwt_authentication],
    User,
    UserCreate,
    UserUpdate,
    UserDB,
)

db = Database("quiz")  # TODO: Rewrite to https://fastapi.tiangolo.com/tutorial/sql-databases


@app.get("/",
         description="Check if site working", tags=['dev'])
def test():
    return {"status": "Hello, slvt!"}


@app.get("/hard_reset",
         description="Drop full database", tags=['dev'])
def hard_reset():
    return db.hard_reset()


@app.put("/user",
         description="Crate new user for quiz")
def create_user(quiz_id: str, username: str):
    is_ok, error = db.add_user(quiz_id, username)
    if is_ok:
        return JSONResponse(status_code=status.HTTP_201_CREATED)
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


@app.put("/quiz",
         description="Create new quiz")
def create_quiz(quiz: Quiz, user: User = Depends(fastapi_users.get_current_user)):
    is_ok, error = db.add_quiz(quiz, user.email)
    if is_ok:
        return JSONResponse(status_code=status.HTTP_201_CREATED)
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


@app.get("/quiz",
         description="Get user quizzes", response_model=List[Quiz])
def get_quiz(user: User = Depends(fastapi_users.get_current_user)):
    is_ok, error, quiz = db.get_quiz(user.email)
    if is_ok:
        return quiz
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


@app.get("/quiz/{quiz_id}",
         description="Get quiz by id", response_model=Quiz)
def get_quiz(quiz_id: str):
    is_ok, error, quiz = db.get_quiz_by_id(quiz_id)
    if is_ok:
        return quiz
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


@app.get("/csv/{quiz_id}",
         description="Export quiz in csv")
async def get_quiz_csv(quiz_id: str):
    is_ok, error, quiz = db.get_quiz_by_id(quiz_id)
    filename = "csv.csv"
    utils.quiz_to_csv(quiz, filename)
    if is_ok:
        return FileResponse(filename)
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


@app.put("/quiz/{quiz_id}",
         description="Answer on quiz")
def question_answer(quiz_id: str, username: str, answer: str):
    is_ok, error = db.add_answer(quiz_id, username, answer)
    if is_ok:
        return JSONResponse(status_code=status.HTTP_201_CREATED)
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


@app.get("/quiz/{quiz_id}/results",
         description="Get quiz results", response_model=List[QuizAnswers])
def get_quiz_results(quiz_id: str):
    is_ok, error, answers = db.get_quiz_results(quiz_id)
    if is_ok:
        return answers
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


### REGISTRATION AND LOGIN

@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


app.include_router(
    fastapi_users.get_auth_router(jwt_authentication),
    prefix="/auth/token",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(),
    prefix="/auth",
    tags=["auth"],
)
