from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import *
from logic import *
from prompts import *
from ai import generateResponse
from chat_memory import addMessage, getHistory

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cart_store = []


@app.get("/")
def root():
    return {
        "message": "Hair Stylist API running"
    }


@app.post("/recommend")
def recommend(req: RecommendRequest):

    recommendation = buildRecommendations(
        req.goal,
        req.hair_type,
        req.current_length,
        req.desired_length_cm,
        req.location
    )

    return recommendation


@app.post("/chat")
def chat(req: ChatRequest):

    recommendation = buildRecommendations(
        req.goal,
        req.hair_type,
        req.current_length,
        req.desired_length_cm,
        req.location
    )

    history = getHistory(req.session_id)

    context = f"""
Recommendation:
{recommendation}

Conversation history:
{history}

User:
{req.user_message}
"""

    try:
        ai_response = generateResponse(context)

    except Exception:
        ai_response = (
            f"{recommendation['method'].capitalize()} "
            f"extensions are perfect for you. "
            f"You'll need {recommendation['grams']}g "
            f"({recommendation['packs']} packs)."
        )

    addMessage(req.session_id, "user", req.user_message)
    addMessage(req.session_id, "assistant", ai_response)

    return {
        "recommendation": recommendation,
        "stylist_response": ai_response,
        "history": getHistory(req.session_id)
    }


@app.post("/faq")
def faq(req: FAQRequest):

    q = req.question.lower()

    faq_map = {
        "damage":
            "No — keratin is very safe when professionally applied.",

        "natural":
            "Yes — the bonds are nearly invisible and blend naturally.",

        "wash":
            "Yes, absolutely. Sulfate-free shampoo is recommended.",

        "pain":
            "No — the application is gentle and painless.",

        "long":
            "Keratin usually lasts 3–5 months with proper care."
    }

    for key, value in faq_map.items():
        if key in q:
            return {
                "response": value,
                "source": "faq"
            }

    try:
        ai_response = generateResponse(
            f"Answer shortly as stylist: {req.question}"
        )

        return {
            "response": ai_response,
            "source": "ai"
        }

    except Exception as e:
        print(e)

        return {
            "response":
                "Our stylists will gladly help you personally.",
            "source": "fallback"
        }


@app.post("/cart/add")
def cartAdd(item: CartItem):

    cart_store.append(item.dict())

    return {
        "message": "Added to cart",
        "cart": cart_store
    }


@app.get("/cart")
def cartView():
    return {
        "cart": cart_store
    }


@app.post("/booking")
def booking(req: BookingRequest):

    return {
        "message":
            "Booking request received successfully.",
        "booking": req.dict()
    }


@app.get("/addons")
def addons():
    return {
        "addons": ADDONS
    }