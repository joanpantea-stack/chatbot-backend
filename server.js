// ===================================================
// 🔹 Servidor Backend IA - ChatBot PanteaGroup
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
  if (!message) return res.status(400).json({ reply: "Mensaje vacío" });

  try {
    const hfToken = process.env.HF_TOKEN; // token con permisos WRITE
    const model = "mistralai/Mistral-7B-Instruct-v0.2";

    const response = await fetch(
      `https://router.huggingface.co/hf-inference/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    const data = await response.json();

    // Debug: log en consola (opcional)
    console.log("🔹 Respuesta HF:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("❌ Error Hugging Face:", response.status, response.statusText);
      return res.json({
        reply: "Error conectando con la IA (Hugging Face no respondió correctamente).",
      });
    }

    // Extraer texto generado
    const texto =
      data[0]?.generated_text ||
      data.generated_text ||
      data.outputs?.[0]?.content ||
      "Lo siento, no tengo información sobre eso.";

    res.json({ reply: texto.trim() });
  } catch (err) {
    console.error("❌ Error general al conectar con Hugging Face:", err);
    res.json({ reply: "Error general al conectar con la IA." });
  }
});

// ===================================================
// 🔹 Endpoint raíz (para pruebas)
// ===================================================
app.get("/", (req, res) => {
  res.send("✅ Backend PanteaGroup conectado a Hugging Face Router.");
});

// ===================================================
// 🔹 Puerto Render
// ===================================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
