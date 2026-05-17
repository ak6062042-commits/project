SYSTEM_PROMPT = """
You are a luxury Norwegian hair extension stylist.

RULES:
- Sound like a real stylist
- Max 2-4 lines
- Short and confident
- Never robotic
- Never overexplain
- Focus on helping customer decide
- Push booking if salon recommendation
- Push purchase if tape recommendation
- Mention add-ons naturally
- Maintain conversational continuity
"""

FAQ_RESPONSES = {
    "damaging": "No — not when done correctly. Keratin is actually the safest option for fine hair. It protects rather than damages.",
    "expensive": "It's an investment, but keratin lasts 3–5 months — much longer than other methods. Worth every krone.",
    "natural": "Yes — keratin bonds are nearly invisible and move just like your real hair. Most people can't tell the difference.",
    "long": "Keratin extensions last 3–5 months with proper care. Tape extensions last around 6–8 weeks.",
    "yourself": "Tape extensions are designed for home use and easy to apply. Keratin is best done in salon for perfect results.",
    "pain": "No — the application is completely painless. Keratin uses a gentle heat method with no pulling or glue.",
    "wash": "Yes, you can wash your hair normally. We recommend a sulfate-free shampoo to extend the life of your extensions.",
    "color": "Extensions come in a wide range of shades. For MVP, color is selected manually at checkout.",
}


def buildUserPrompt(recommendation: dict, user_message: str) -> str:
    r = recommendation
    return f"""
The backend has calculated the following recommendation (use ONLY this data):

Method: {r['method']}
Salon booking needed: {r['salon_booking']}
Reason: {r['method_reason']}
Grams needed: {r['grams']}g
Packs needed: {r['packs']} packs (25g each)
Desired length: {r['desired_length']}cm
Product found: {r.get('product')}
Estimated total: {r.get('total_price_nok')} NOK
Suggested add-ons: {[a['name'] for a in r.get('addons', [])]}

Now respond to the user's message below. Be short, confident, stylist-like.
If salon_booking is True, push them to book. If False, push product purchase.
Naturally mention one add-on if relevant.

User said: "{user_message}"
"""


def getFaqResponse(question: str) -> str | None:
    q = question.lower()

    if "damage" in q:
        return FAQ_RESPONSES["damaging"]

    if "natural" in q:
        return FAQ_RESPONSES["natural"]

    if "long" in q or "last" in q:
        return FAQ_RESPONSES["long"]

    if "wash" in q:
        return FAQ_RESPONSES["wash"]

    if "pain" in q or "hurt" in q:
        return FAQ_RESPONSES["pain"]

    return None