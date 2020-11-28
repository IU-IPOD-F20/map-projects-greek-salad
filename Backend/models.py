from typing import List, Dict
from pydantic import BaseModel, Field


class SimpleQuestion(BaseModel):
    question: str = Field(example="What is pi number?")
    answers: Dict[str, int] = Field(example={"3.14": 1, "3.1415": 1, "2": 0},
                                    description="key is answer, value is number of point for choosing this answers")


class Quiz(BaseModel):
    quiz_id: str = Field(example="1")
    questions: List[SimpleQuestion]
