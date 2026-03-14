const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors({ origin: "*" }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", keyLoaded: !!GEMINI_API_KEY });
});

// Nutrition analysis endpoint
app.post("/api/analyze", async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini API key not configured on server." });
  }

  const { foodDescription, meal, profile, todayTotals, goals } = req.body;

  if (!foodDescription || !meal) {
    return res.status(400).json({ error: "foodDescription and meal are required." });
  }

  const prompt = `You are a precise nutrition AI. The user is adding food to their ${meal}.

User said: "${foodDescription}"

Their daily goals: ${goals?.calories || 2000} cal, ${goals?.protein || 150}g protein, ${goals?.carbs || 200}g carbs, ${goals?.fat || 65}g fat
Today so far: ${Math.round(todayTotals?.calories || 0)} cal, ${Math.round(todayTotals?.protein || 0)}g protein
Their goal: ${profile?.goal || "maintain"}

Respond ONLY with a valid JSON object (no markdown, no explanation, no backticks) in exactly this format:
{
  "items": [
    {
      "name": "Food name",
      "quantity": "amount eaten",
      "calories": 250,
      "protein": 20,
      "carbs": 30,
      "fat": 8,
      "fiber": 3
    }
  ],
  "message": "A brief friendly message about the food added and any nutrition insight (1-2 sentences)"
}

If multiple foods are mentioned, include each as a separate item. Be accurate with nutritional values. All macros in grams.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: `Gemini API error: ${err}` });
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🌿 NutriTrack backend running on http://localhost:${PORT}`);
  console.log(`   Gemini API key loaded: ${GEMINI_API_KEY ? "✅ Yes" : "❌ No — add it to .env"}\n`);
});