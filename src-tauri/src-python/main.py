from groq import Groq
from google import genai
from google.genai import types

_tauri_plugin_functions = ["greet_python", "generate_response",] 

def greet_python():
    return str("Hello from python bro!")

def generate_response(data) -> str:
    user_input = data.get("user_input")
    mode = data.get("mode")
    provider = data.get("provider")
    api_key = data.get("api_key")

    # Groq
    if provider == "groq":
        client = Groq(api_key=api_key) 

        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a grammar correction assistant. Return only the corrected "
                            "version of the text provided, or the original text if no changes "
                            "are needed. Do not include explanations. "
                        ),
                    },
                    {
                        "role": "user",
                        "content": user_input,
                    },
                ] if mode == "correction" else [
                    {
                        "role": "system",
                        "content": (
                            "You are a paraphraser assistant. Return only the paraphrased "
                            "version of the text provided. Do not include explanations."
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
            print("mode: " + mode)
            print("provider: groq")
            print(result)
            return result.strip()

        except Exception as error:
            print(f"Error calling Groq API: {error}")
            raise RuntimeError("Failed to generate response from Groq API.")

    # Gemini
    elif provider == "gemini":
        try:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                config=types.GenerateContentConfig(
                    system_instruction=(
                        "You are a grammar correction assistant. Return only the corrected "
                        "version of the text provided, or the original text if no changes "
                        "are needed. Do not include explanations."
                    ) if mode == "correction" else (
                        "You are a paraphraser assistant. Return only the paraphrased "
                        "version of the text provided. Do not include explanations."
                    )
                ),
                contents=user_input
            )
            print("mode: " + mode)
            print("provider: gemini")
            print(response)
            return response.text
        except Exception as error:
            print(f"Error calling Gemini API: {error}")
            raise RuntimeError("Failed to generate response from Gemini API.")