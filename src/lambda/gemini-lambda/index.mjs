import axios from "axios";

export const handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    let body;
    try {
      body =
        typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch (parseErr) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    const prompt = body?.prompt;
    if (!prompt || typeof prompt !== "string" || prompt.length > 1000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid or too long prompt" }),
      };
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(
      geminiUrl,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ output: response.data }),
    };
  } catch (error) {
    console.error("Lambda Gemini Error:", error?.response?.data || error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error?.response?.data || error.message,
      }),
    };
  }
};
