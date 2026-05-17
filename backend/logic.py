from math import ceil
from json import load
import os

SALON_LOCATIONS = [
    "oslo",
    "lillestrøm",
    "lørenskog"
]

ADDONS = [
    {"id": "heat_protection", "name": "Heat Protection Spray", "price_nok": 199},
    {"id": "brush", "name": "Extension Brush", "price_nok": 149},
    {"id": "remover", "name": "Keratin Remover", "price_nok": 179},
    {"id": "silky_cap", "name": "Silk Cap", "price_nok": 99}
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PRODUCT_PATH = os.path.join(BASE_DIR, "products.json")


def calculateGrams(goal: str, hair_type: str) -> int:
    hair_type = hair_type.lower()
    goal = goal.lower()

    if hair_type == "thin":
        return 125 if goal == "volume" else 175

    if hair_type == "medium":
        return 175

    if hair_type == "thick":
        return 225

    return 175


def calculatePacks(grams: int, grams_per_pack: int = 25):
    return ceil(grams / grams_per_pack)


def recommendMethod(location: str):
    is_local = location.lower() in SALON_LOCATIONS

    if is_local:
        return {
            "method": "keratin",
            "salon_booking": True,
            "reason":
                "Keratin gives the most natural and long-lasting salon result."
        }

    return {
        "method": "tape",
        "salon_booking": False,
        "reason":
            "Tape extensions are easier for at-home application."
    }


def getProduct(method: str, desired_length_cm: int):
    with open(PRODUCT_PATH, encoding="utf-8") as f:
        products = load(f)

    exact = [
        p for p in products
        if p["method"] == method
        and p["length_cm"] == desired_length_cm
    ]

    if exact:
        return exact[0]

    candidates = [
        p for p in products
        if p["method"] == method
        and p["length_cm"] >= desired_length_cm
    ]

    return candidates[0] if candidates else None


def suggestAddons(method: str):
    suggestions = ["heat_protection", "brush"]

    if method == "keratin":
        suggestions.append("remover")

    return [
        addon for addon in ADDONS
        if addon["id"] in suggestions
    ]


def buildRecommendations(
    goal,
    hair_type,
    current_length,
    desired_length_cm,
    location
):
    grams = calculateGrams(goal, hair_type)

    packs = calculatePacks(grams)

    method_info = recommendMethod(location)

    product = getProduct(
        method_info["method"],
        desired_length_cm
    )

    addons = suggestAddons(method_info["method"])

    total_price = (
        product["price_nok"] * packs
        if product else None
    )

    return {
        "method": method_info["method"],
        "salon_booking": method_info["salon_booking"],
        "method_reason": method_info["reason"],
        "grams": grams,
        "packs": packs,
        "desired_length": desired_length_cm,
        "product": product,
        "total_price_nok": total_price,
        "addons": addons
    }