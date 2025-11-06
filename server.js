// ===================================================
// 🔹 Servidor Backend IA - ChatBot Panteagroup
// ===================================================
// - Usa OpenAI GPT-3.5-Turbo (ChatGPT oficial)
// - Lee la clave de entorno OPENAI_API_KEY (Render)
// ===================================================

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ===================================================
// 🔹 Endpoint principal de la IA (OpenAI ChatGPT)
// ===================================================
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "Mensaje vacío" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente técnico de Panteagroup. Responde de forma clara, amable y profesional."
          },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      console.error("❌ Error OpenAI:", response.status, response.statusText);
      return res.json({ reply: "Error conectando con la IA (OpenAI no respondió correctamente)." });
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Lo siento, no tengo información sobre eso.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error general al conectar con OpenAI:", error);
    res.json({ reply: "Error conectando con la IA (OpenAI)." });
  }
});

// ===================================================
// 🔹 Endpoint raíz para comprobar el servidor
// ===================================================
app.get("/", (req, res) => {
  res.send("✅ Servidor IA de Panteagroup operativo con ChatGPT-3.5-Turbo.");
});

// ===================================================
// 🔹 Puerto de Render
// ===================================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor IA activo en puerto ${PORT}`);
});
