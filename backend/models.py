from pydantic import BaseModel
from typing import Optional

class RecommendRequest(BaseModel):
    goal: str
    hair_type: str
    current_length: str
    desired_length_cm: int
    location: str


class ChatRequest(RecommendRequest):
    user_message: str
    session_id: Optional[str] = "default"


class FAQRequest(BaseModel):
    question: str


class CartItem(BaseModel):
    method: str
    desired_length_cm: int
    grams: int
    packs: int
    addon_ids: list[str] = []


class BookingRequest(BaseModel):
    name: str
    email: str
    preferred_date: Optional[str] = None
    notes: Optional[str] = None