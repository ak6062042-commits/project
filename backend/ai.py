from google import genai
from google.genai import types

from dotenv import load_dotenv

from prompts import SYSTEM_PROMPT

import os

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "Missing GEMINI_API_KEY in .env"
    )

client = genai.Client(
    api_key=API_KEY
)


def generateResponse(prompt: str) -> str:

    try:

        response = client.models.generate_content(
            model="gemini-2.0-flash",

            contents=prompt,

            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.6,
                max_output_tokens=200,
            )
        )

        if response.text:
            return response.text.strip()

        raise Exception(
            "Empty Gemini response"
        )

    except Exception as e:

        print("GEMINI ERROR:", e)

        raise