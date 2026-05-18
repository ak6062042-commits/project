from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from logic import (
    buildRecommendations,
    ADDONS
)

from prompts import (
    buildUserPrompt,
    getFaqResponse
)

from ai import generateResponse

from models import (
    RecommendRequest,
    ChatRequest,
    FAQRequest,
    CartItem,
    BookingRequest
)

from chat_memory import (
    addMessage,
    buildConversationString
)


app = FastAPI(
    title="Hair Extension Stylist API",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

cart_store = []


def buildFallbackResponse(r: dict):

    method = r["method"].capitalize()

    return (
        f"{method} extensions would suit your hair perfectly. "
        f"You'll need around {r['grams']}g "
        f"({r['packs']} packs) at "
        f"{r['desired_length']}cm."
    )


@app.get("/")
def root():

    return {
        "message":
        "API running successfully"
    }


@app.post("/recommend")
def recommend(
    req: RecommendRequest
):

    return buildRecommendations(
        req.goal,
        req.hair_type,
        req.current_length,
        req.desired_length_cm,
        req.location
    )


@app.post("/chat")
async def chat(
    req: ChatRequest
):

    recommendation = buildRecommendations(
        req.goal,
        req.hair_type,
        req.current_length,
        req.desired_length_cm,
        req.location
    )

    history = buildConversationString(
        req.session_id
    )

    user_prompt = buildUserPrompt(
        recommendation,
        req.user_message
    )

    final_prompt = f"""
Conversation history:
{history}

Current request:
{user_prompt}
"""

    try:

        response = generateResponse(
            final_prompt
        )

    except Exception:

        response = buildFallbackResponse(
            recommendation
        )

    addMessage(
        req.session_id,
        "user",
        req.user_message
    )

    addMessage(
        req.session_id,
        "assistant",
        response
    )

    return {
        "recommendation":
        recommendation,

        "stylist_response":
        response
    }


@app.post("/faq")
async def faq(
    req: FAQRequest
):

    hardcoded = getFaqResponse(
        req.question
    )

    if hardcoded:

        return {
            "response": hardcoded,
            "source": "faq"
        }

    prompt = f"""
Customer question:
{req.question}

Reply naturally in 2-3 lines.
"""

    try:

        response = generateResponse(
            prompt
        )

        return {
            "response": response,
            "source": "ai"
        }

    except Exception:

        return {
            "response":
            "Our stylists would be happy to help you personally.",
            "source": "fallback"
        }


@app.post("/cart/add")
def add_to_cart(
    item: CartItem
):

    cart_store.append(
        item.dict()
    )

    return {
        "message":
        "Added to cart.",

        "cart":
        cart_store
    }


@app.get("/cart")
def view_cart():

    return {
        "cart":
        cart_store
    }


@app.post("/booking")
def booking(
    req: BookingRequest
):

    return {
        "message":
        "Booking request received.",

        "booking":
        req.dict()
    }


@app.get("/addons")
def addons():

    return {
        "addons":
        ADDONS
    }