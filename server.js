// ===================================================
// 🔹 Servidor Backend IA - ChatBot Panteagroup
// ===================================================
// - Intermedia entre el frontend (IONOS) y Hugging Face
// - Evita bloqueos CORS
// - Usa token seguro guardado en Render
// ===================================================

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ===================================================
// 🔹 Cargar API Key de Hugging Face desde variables de entorno
// ===================================================
const API_KEY = process.env.HUGGINGFACE_API_KEY || "";
if (!API_KEY) {
  console.warn("⚠️ No se encontró la variable HUGGINGFACE_API_KEY en Render.");
  console.warn("Ve a 'Environment → Environment Variables' y añade tu token de Hugging Face.");
}

// ===================================================
// 🔹 Endpoint principal de la IA
// ===================================================
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Mensaje vacío" });
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/tiiuae/falcon-7b-instruct",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    if (!response.ok) {
      console.error("❌ Error Hugging Face:", response.status, response.statusText);
      return res.json({ reply: "Error conectando con la IA (Hugging Face no respondió correctamente)." });
    }

    const data = await response.json();

    // El modelo puede devolver distintos formatos de JSON
    const reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      data?.outputs?.[0]?.content ||
      "Lo siento, no tengo información sobre eso.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error general al conectar con la IA:", error);
    res.json({ reply: "Error conectando con la IA." });
  }
});

// ===================================================
// 🔹 Endpoint raíz para comprobar el servidor
// ===================================================
app.get("/", (req, res) => {
  res.send("✅ Servidor IA de Panteagroup operativo.");
});

// ===================================================
// 🔹 Puerto de Render
// ===================================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor IA activo en puerto ${PORT}`);
});
