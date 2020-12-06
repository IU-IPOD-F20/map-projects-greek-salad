from fastapi import FastAPI, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi_users.authentication import CookieAuthentication
from fastapi_users import FastAPIUsers
from user_models import *
from database import Database
from models import *
from fastapi.middleware.cors import CORSMiddleware

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
cookie_authentication = CookieAuthentication(secret=SECRET, lifetime_seconds=3600)

fastapi_users = FastAPIUsers(
    user_db,
    [cookie_authentication],
    User,
    UserCreate,
    UserUpdate,
    UserDB,
)

db = Database("quiz")  # TODO: Rewrite to https://fastapi.tiangolo.com/tutorial/sql-databases


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
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


@app.put("/quiz",
         description="Create new quiz")
def create_quiz(quiz: Quiz, user: User = Depends(fastapi_users.get_current_user)):
    is_ok, error = db.add_quiz(quiz, user.email)
    if is_ok:
        return JSONResponse(status_code=status.HTTP_201_CREATED)
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


@app.get("/quiz",
         description="Get quiz", response_model=List[Quiz])
def get_quiz(user: User = Depends(fastapi_users.get_current_user)):
    is_ok, error, quiz = db.get_quiz(user.email)
    if is_ok:
        return quiz
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


@app.put("/quiz/{quiz_id}",
         description="Answer on quiz")
def question_answer(quiz_id: str, username: str, answer: str):
    is_ok, error = db.add_answer(quiz_id, username, answer)
    if is_ok:
        return JSONResponse(status_code=status.HTTP_201_CREATED)
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


@app.get("/quiz/{quiz_id}",
         description="Get quiz results", response_model=List[QuizAnswers])
def get_quiz_results(quiz_id: str):
    is_ok, error, answers = db.get_quiz_results(quiz_id)
    if is_ok:
        return answers
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


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
