import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// AI content generator endpoint
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // ✅ Free model
        messages: [
          {
            role: "system",
            content:
              'You are a social media assistant. Return only a JSON object like this:\n{\n  "caption": "...",\n  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]\n}',
          },
          {
            role: "user",
            content: `Generate a catchy Instagram caption and 5 trending hashtags for the topic: "${prompt}".`,
          },
        ],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Parse the content string into actual JSON
    const parsed = JSON.parse(response.data.choices[0].message.content);
    res.json({ result: parsed });
  } catch (error) {
    console.error("AI Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
