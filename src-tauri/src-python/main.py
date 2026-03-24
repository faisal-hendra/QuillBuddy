import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()  # call this once at the top to load .env

_tauri_plugin_functions = ["greet_python", "generate_response"]  # both in one list

def greet_python():
    return str("Hello from python bro!")

def generate_response(user_input: str) -> str:
    client = Groq(api_key=os.environ.get("GROQ_API_KEY")) 

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a grammar correction assistant. Return only the corrected "
                        "version of the text provided, or the original text if no changes "
                        "are needed. Do not include explanations."
                    ),
                },
                {
                    "role": "user",
                    "content": user_input,
                },
            ],
            model="moonshotai/kimi-k2-instruct-0905",
        )

        result = chat_completion.choices[0].message.content or ""
        print(result)
        return result.strip()

    except Exception as error:
        print(f"Error calling Groq API: {error}")
        raise RuntimeError("Failed to generate response from Groq API.")