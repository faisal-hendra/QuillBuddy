import Groq from "groq-sdk";

export const generateResponse = async (userInput) => {
  // Initialize Groq client with the API key from environment variables
  const groq = new Groq({
    dangerouslyAllowBrowser: true,
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
  });

  try {
    // Call the Groq API for chat completion
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a grammar correction assistant. Return only the corrected version of the text provided, or the original text if no changes are needed. Do not include explanations.",
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      // Using a free Groq model, kimi-k2 is pretty robust and no-nonsense LLM
      model: "moonshotai/kimi-k2-instruct-0905",
    });

    // Extract and return the result content
    const result = chatCompletion.choices[0]?.message?.content || "";
    console.log(result);
    return result.trim();
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw new Error("Failed to generate response from Groq API.");
  }
};
