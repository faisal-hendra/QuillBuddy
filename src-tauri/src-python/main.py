from groq import Groq
from google import genai
from google.genai import types
from cerebras.cloud.sdk import Cerebras
from openai import OpenAI
    
_tauri_plugin_functions = ["greet_python", "generate_response",] 

def greet_python():
    return str("Hello from python bro!")

def generate_response(data) -> str:
    user_input = data.get("user_input")
    mode = data.get("mode")
    provider = data.get("provider")
    api_key = data.get("api_key")
    
    # Check whether we're in correction or paraphrase mode
    isCorrectionMode = mode == "correction"
    
    # Prompt to instruct the system
    system_prompt_correction = "You are a grammar correction assistant. Return only the corrected version of the text provided, or the original text if no changes are needed. Do not include explanations."
    system_prompt_paraphrase =  "You are a paraphraser assistant. Return only the paraphrased version of the text provided. Do not include explanations."
    system_prompt = system_prompt_correction if isCorrectionMode else system_prompt_paraphrase
    
    # Groq
    if provider == "groq":
        client = Groq(api_key=api_key) 
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
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
        client = genai.Client(api_key=api_key)
        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                config=types.GenerateContentConfig(
                    system_instruction= system_prompt
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
        
    # Cerebras
    elif (provider == "cerebras"):
        client = Cerebras(api_key=api_key)
        try:
            response = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": user_input,
                    }
            ],
                model="llama3.1-8b",
            )
            print(response)
            return response.choices[0].message.content
        
        except Exception as error:
            print(f"Error calling Cerebras API: {error}")
            raise RuntimeError("Failed to generate response from Cerebras API.")
        
    # OpenRouter
    elif provider == "openrouter":
        client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key,)
        try:
            response = client.chat.completions.create(
            model="openrouter/auto",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_input
                }
            ]
            )
            print("OpenROuter System Prompt: " + system_prompt)
            print(response.choices[0].message.content)
            return response.choices[0].message.content
        except Exception as error:
            print(f"Error calling openrouter API: {error}")
            raise RuntimeError("Failed to generate response from openrouter API.")       