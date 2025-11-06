// ===================================================
// 🔹 Servidor Backend IA - ChatBot Panteagroup (Gratis)
// ===================================================
// - Usa modelo Mistral 7B Instruct en Hugging Face
// - Requiere solo un token gratuito con permisos READ
// ===================================================

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ===================================================
// 🔹 Endpoint principal de la IA (Mistral gratuito)
// ===================================================
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "Mensaje vacío" });
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: message })
      }
    );

    if (!response.ok) {
      console.error("❌ Error Hugging Face:", response.status, response.statusText);
      return res.json({
        reply: "Error conectando con la IA (Mistral no respondió correctamente)."
      });
    }

    const data = await response.json();

    // Manejar distintos formatos posibles de respuesta
    const reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      data?.outputs?.[0]?.content ||
      "Lo siento, no tengo información sobre eso.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error general al conectar con Mistral:", error);
    res.json({ reply: "Error conectando con la IA." });
  }
});

// ===================================================
// 🔹 Endpoint raíz
// ===================================================
app.get("/", (req, res) => {
  res.send("✅ Servidor IA de Panteagroup operativo con Mistral 7B (token gratuito).");
});

// ===================================================
// 🔹 Puerto
// ===================================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor IA activo en puerto ${PORT}`);
});
