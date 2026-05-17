from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

from logic import buildRecommendations, suggestAddons
from prompts import SYSTEM_PROMPT, buildUserPrompt

load_dotenv()

app = FastAPI(
    title="Hair Extension Stylist API",
    description="Guided AI stylist + recommendation engine for hair extensions",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class RecommendRequest(BaseModel):
    goal: str
    hair_type: str
    current_length: str
    desired_length_cm: int
    location: str

class ChatRequest(BaseModel):
    goal: str
    hair_type: str
    current_length: str
    desired_length_cm: int
    location: str
    user_message: str

class CartItem(BaseModel):
    method: str
    desired_length_cm: int
    grams: int
    packs: int
    addon_ids: Optional[list[str]] = []

class BookingRequest(BaseModel):
    name: str
    email: str
    preferred_date: Optional[str] = None
    notes: Optional[str] = None


cart_store: list = []


def getGeminiResponse(prompt: str) -> str:
    from google import genai
    from google.genai import types

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found in .env")

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            max_output_tokens=200,
            temperature=0.5,
        ),
        contents=prompt,
    )
    return response.text.strip()


@app.get("/")
def root():
    return {"message": "Hair Extension Stylist API is running. Visit /docs for Swagger UI."}


@app.post("/recommend", summary="Get hair extension recommendation (no AI)")
def recommend(req: RecommendRequest):
    result = buildRecommendations(
        goal=req.goal,
        hair_type=req.hair_type,
        current_length=req.current_length,
        desired_length_cm=req.desired_length_cm,
        location=req.location,
    )
    return result

def buildFallbackResponse(r: dict) -> str:
    method = r["method"].capitalize()
    grams = r["grams"]
    packs = r["packs"]
    length = r["desired_length"]

    if r["salon_booking"]:
        return (
            f"{method} extensions are the best choice for your hair. "
            f"You'll need {grams}g — that's {packs} packs at {length}cm. "
            f"Since you're near Oslo, I recommend booking a salon appointment for the best result."
        )
    else:
        return (
            f"{method} extensions are perfect for your needs. "
            f"You'll need {grams}g — that's {packs} packs at {length}cm. "
            f"You can easily apply these yourself at home."
        )


@app.post("/chat", summary="AI stylist response (uses /recommend logic + Gemini)")
async def chat(req: ChatRequest):
    recommendation = buildRecommendations(
        goal=req.goal,
        hair_type=req.hair_type,
        current_length=req.current_length,
        desired_length_cm=req.desired_length_cm,
        location=req.location,
    )

    user_prompt = buildUserPrompt(recommendation, req.user_message)

    try:
        ai_text = getGeminiResponse(user_prompt)
    except Exception:
        ai_text = buildFallbackResponse(recommendation)

    return {
        "recommendation": recommendation,
        "stylist_response": ai_text,
    }


@app.post("/cart/add", summary="Add recommended product to cart")
def cart_add(item: CartItem):
    cart_store.append(item.dict())
    return {"message": "Added to cart.", "cart": cart_store}


@app.get("/cart", summary="View current cart")
def cart_view():
    return {"cart": cart_store}


@app.post("/booking", summary="Submit salon booking request")
def booking(req: BookingRequest):
    return {
        "message": "Booking received! We'll confirm within 24 hours.",
        "booking": req.dict()
    }


@app.get("/addons", summary="List all available add-ons")
def get_addons():
    from logic import ADDONS
    return {"addons": ADDONS}