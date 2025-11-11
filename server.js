// ===================================================
// 🔹 ChatBot PanteaGroup - Conexión IA mediante OpenRouter.ai
// ===================================================

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ===================================================
// 🔹 Endpoint principal
// ===================================================
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Mensaje vacío" });

  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY || "sk-or-v1-xxxxxxxxxxxx"; // ⚠️ Reemplaza si no usas variables de entorno

    // Puedes elegir el modelo que prefieras:
    const model = "google/gemma-3-27b-it:free";   // modelo gratuito
    // Otros disponibles: "meta-llama/llama-3-8b-instruct", "google/gemma-2-9b-it"

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "Eres un asistente técnico de PanteaGroup. Responde siempre en español de manera clara y profesional.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("❌ Error OpenRouter:", response.status, response.statusText);
      return res.json({ reply: "Error conectando con la IA (OpenRouter no respondió correctamente)." });
    }

    const data = await response.json();

    const texto =
      data?.choices?.[0]?.message?.content || "Lo siento, no tengo información sobre eso.";

    res.json({ reply: texto.trim() });
  } catch (error) {
    console.error("❌ Error general al conectar con OpenRouter:", error);
    res.json({ reply: "Error general al conectar con la IA (OpenRouter)." });
  }
});

// ===================================================
// 🔹 Endpoint raíz
// ===================================================
app.get("/", (req, res) => {
  res.send("✅ Backend de PanteaGroup conectado a OpenRouter.ai");
});

// ===================================================
// 🔹 Puerto Render
// ===================================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
