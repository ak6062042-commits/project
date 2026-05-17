import os
from google import genai
from google.genai import types 
from dotenv import load_dotenv

from prompts import SYSTEM_PROMPT

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise Exception("Missing GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

def generateResponse(prompt: str) -> str:
    try:
       
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.5,
                max_output_tokens=200,
            )
        )

        if response.text:
            return response.text.strip()

        raise Exception("Empty response")

    except Exception as e:
        print("GEMINI ERROR:", e)
        raise
