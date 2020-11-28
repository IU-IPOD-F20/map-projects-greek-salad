from typing import List, Dict
from pydantic import BaseModel, Field


class SimpleQuestion(BaseModel):
    question: str = Field(example="How old are you?")
    answers: Dict[str, int] = Field(example={"10": 1, "18": 1, "-1": 0})


class Quiz(BaseModel):
    quiz_id: str = Field(example="1")
    questions: List[SimpleQuestion]
