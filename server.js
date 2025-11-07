// ===================================================
// 🔹 Servidor Backend IA - ChatBot PanteaGroup
// ===================================================
// Envía mensajes al Space gratuito de Hugging Face
// (por ejemplo: https://tuusuario-pantea-mistral.hf.space)
// ===================================================

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ===================================================
// 🔹 Endpoint principal del chatbot
// ===================================================
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "Mensaje vacío" });
  }

  try {
    // 🔸 Cambia esta URL por la de tu propio Space:
    const spaceURL = "https://joanpantea-pantea-mistral.hf.space//run/predict";

    const response = await fetch(spaceURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [message] })
    });

    if (!response.ok) {
      console.error("❌ Error llamando al Space:", response.status, response.statusText);
      return res.json({ reply: "Error conectando con la IA (Space no respondió correctamente)." });
    }

    const data = await response.json();

    // Hugging Face Spaces devuelven { "data": [ "texto" ] }
    const reply = data?.data?.[0] || "Lo siento, no tengo información sobre eso.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error general al conectar con Space:", error);
    res.json({ reply: "Error conectando con la IA (Space)." });
  }
});

// ===================================================
// 🔹 Endpoint raíz
// ===================================================
app.get("/", (req, res) => {
  res.send("✅ Backend de PanteaGroup conectado al Space IA.");
});

// ===================================================
// 🔹 Puerto Render
// ===================================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend activo en puerto ${PORT}`);
});
