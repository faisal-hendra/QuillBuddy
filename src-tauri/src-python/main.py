import sys
sys.path.insert(0, "/Users/faisalhendra/Desktop/QuillBuddy/.venv/bin/python3")

# src-tauri/src-python/main.py
import os
from dotenv import load_dotenv
from groq import Groq

_tauri_plugin_functions = ["greet_python"]  # make "greet_python" callable from UI
def greet_python():
    return str("Hello from python bro!")

_tauri_plugin_functions = ["generate_response"] 
def generate_response(user_input: str) -> str:
    # Initialize Groq client with the API key from environment variables
    client = Groq(api_key=load_dotenv("GROQ_API_KEY"))

    try:
        # Call the Groq API for chat completion
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
            # Using a free Groq model, kimi-k2 is pretty robust and no-nonsense LLM
            model="moonshotai/kimi-k2-instruct-0905",
        )

        # Extract and return the result content
        result = chat_completion.choices[0].message.content or ""
        print(result)
        return result.strip()

    except Exception as error:
        print(f"Error calling Groq API: {error}")
        raise RuntimeError("Failed to generate response from Groq API.")
