from fastapi import FastAPI, status
from fastapi.responses import JSONResponse

from database import Database

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
def create_quiz(quiz_id: str):
    is_ok, error = db.add_quiz(quiz_id)
    if is_ok:
        return JSONResponse(status_code=status.HTTP_201_CREATED)
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": error})
