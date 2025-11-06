// ===================================================
// 🔹 Servidor Backend IA - ChatBot Panteagroup
// ===================================================
// - Versión libre y funcional con modelo público GPT-2
// - No requiere token ni permisos especiales
// - Ideal para entorno gratuito en Render + IONOS
// ===================================================

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ===================================================
// 🔹 Endpoint principal de la IA (usando GPT-2 público)
// ===================================================
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Mensaje vacío" });
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/gpt2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    if (!response.ok) {
      console.error("❌ Error Hugging Face:", response.status, response.statusText);
      return res.json({ reply: "Error conectando con la IA (GPT-2 no respondió correctamente)." });
    }

    const data = await response.json();

    // GPT-2 normalmente devuelve un array con generated_text
    const reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      "Lo siento, no tengo información sobre eso.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error general al conectar con GPT-2:", error);
    res.json({ reply: "Error conectando con la IA." });
  }
});

// ===================================================
// 🔹 Endpoint raíz para comprobar el servidor
// ===================================================
app.get("/", (req, res) => {
  res.send("✅ Servidor IA de Panteagroup operativo con GPT-2.");
});

// ===================================================
// 🔹 Puerto de Render
// ===================================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor IA activo en puerto ${PORT}`);
});
