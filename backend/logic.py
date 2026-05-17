from math import ceil
from json import load

SALON_LOCATIONS = ["oslo", "lillestrøm", "lillestrøm", "lørenskong"]

ADDONS = [
    {"id": "heat_protection", "name": "Heat Protection Spray", "price_nok": 199},
    {"id": "brush", "name": "Extension Brush", "price_nok": 149},
    {"id": "remover", "name": "Keratin Remover", "price_nok": 179},
    {"id": "silky_cap", "name": "Silk Cap", "price_nok": 99}
]

def calculateGrams(goal: str, hair_type: str) -> int:
    goal = goal.lower()
    hair_type = hair_type.lower()
    
    if hair_type == "thin":
        return 125 if goal == "volume" else 175
    elif hair_type == "medium":
        return 175
    elif hair_type == "thick":
        return 225
    return 175

def calculatePacks(grams: int, grams_per_pack: int = 25) -> int:
    return ceil(grams / grams_per_pack)

def recommendMethod(hair_type: str, location: str) -> dict:
    is_local = location.lower() in SALON_LOCATIONS
    
    if is_local:
        return {
            "method" : "keratin",
            "salon_booking" : True,
            "reason": "Keratin is the safest, most natural method for your hair type."
        }
    else:
        return{
            "method" : "keratin",
            "salon_booking": False,
            "reason": "Tape extensions are most easy to apply yourself for remote customers."
        }

def getProduct(method: str, desired_length_cm: int) -> dict:
    import os
    
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(BASE_DIR, "products.json")
    with open(path) as f:
        products = load(f)
    
    for p in products:
        if p["method"] == method and p["length_cm"] == desired_length_cm:
            return p
    
    candidates = [p for p in products if p["method"] == method
                  and p["length_cm"] >= desired_length_cm]
    return candidates[0] if candidates else None

def suggestAddons(method: str) -> list:
    suggestions = ["heat_protection", "brush"]
    if method == "keratin":
        suggestions.append("remover")
    return [a for a in ADDONS if a["id"] in suggestions]

def buildRecommendations(
    goal: str, hair_type: str,
    current_length: str, desired_length_cm: int,
    location: str
) -> dict:
    grams = calculateGrams(goal, hair_type)
    packs = calculatePacks(grams)
    method_info = recommendMethod(hair_type, location)
    product = getProduct(method_info["method"], desired_length_cm)
    addons = suggestAddons(method_info["method"])
    
    total_price = (product["price_nok"] * packs) if product else None
    return {
        "method":          method_info["method"],
        "salon_booking":   method_info["salon_booking"],
        "method_reason":   method_info["reason"],
        "grams":           grams,
        "packs":           packs,
        "desired_length":  desired_length_cm,
        "product":         product,
        "total_price_nok": total_price,
        "addons":          addons,
    }
    
        