// lib/gemini.ts

const LAMBDA_API_URL = process.env.LAMBDA_GEMINI_API_URL!;

type GeminiApiResponse = {
  output?: {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };
};

export async function generateGeminiContent(prompt: string) {
  try {
    const response = await fetch(LAMBDA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiApiResponse = await response.json();
    const reply = data.output?.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply || "No response.";
  } catch (error) {
    console.error("Lambda Gemini Error:", error);
    return "Something went wrong.";
  }
}
