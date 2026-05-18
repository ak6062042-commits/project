SYSTEM_PROMPT = """
You are a luxury Norwegian hair extension stylist.

RULES:
- Sound like a real stylist
- Never sound robotic
- Keep answers short
- Max 2-4 lines
- Be calm and confident
- Help customer decide
- Push salon booking naturally for keratin
- Push purchase naturally for tape
- Mention add-ons naturally
- Maintain conversation continuity
- Never overexplain
"""


FAQ_RESPONSES = {

    "damaging":
    "No — not when done correctly. Keratin is one of the safest methods for fine hair.",

    "expensive":
    "It lasts much longer than cheaper methods, so most clients feel it's worth the investment.",

    "natural":
    "Yes — keratin bonds are extremely discreet and blend naturally with your own hair.",

    "long":
    "Keratin usually lasts 3–5 months with proper aftercare.",

    "wash":
    "Yes, absolutely. Sulfate-free products help extensions stay beautiful longer.",

    "pain":
    "No — the application process is gentle and comfortable."
}


def buildUserPrompt(
    recommendation: dict,
    user_message: str
):

    r = recommendation

    return f"""
Use ONLY this recommendation data.

Method:
{r['method']}

Salon booking:
{r['salon_booking']}

Reason:
{r['method_reason']}

Grams:
{r['grams']}g

Packs:
{r['packs']} packs

Desired Length:
{r['desired_length']}cm

Total:
{r['total_price_nok']} NOK

Add-ons:
{[a['name'] for a in r['addons']]}

Customer said:
"{user_message}"

Reply like a luxury stylist.
"""


def getFaqResponse(
    question: str
):

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

    if "expensive" in q or "price" in q:
        return FAQ_RESPONSES["expensive"]

    return None