import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Cargar base local
const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

// 🔹 Función para buscar coincidencias locales
function buscarRespuestaLocal(message, modo) {
  const text = message.toLowerCase();
  const items = data[modo] || [];
  for (const item of items) {
    if (item.preguntas.some(q => text.includes(q.toLowerCase()))) {
      return item.respuesta;
    }
  }
  return null;
}

// 🔹 Endpoint principal
app.post("/chat", async (req, res) => {
  const { message, mode } = req.body;
  if (!message || !mode) return res.status(400).json({ reply: "Mensaje vacío o modo no definido" });

  // 🔹 1️⃣ Buscar en base local
  const respuestaLocal = buscarRespuestaLocal(message, mode);
  if (respuestaLocal) {
    return res.json({ reply: respuestaLocal, source: "local" });
  }

  // 🔹 2️⃣ Si no hay coincidencia, llamar a la IA
  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY || "sk-or-v1-xxxxxxxx";
    const model = "google/gemma-3-27b-it:free";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "Eres un asistente técnico de PanteaGroup. Responde en español de manera clara y profesional." },
          { role: "user", content: message }
        ],
      }),
    });

    const dataIA = await response.json();
    const textoIA = dataIA?.choices?.[0]?.message?.content || "Lo siento, no tengo información sobre eso.";

    res.json({ reply: textoIA, source: "ai" });
  } catch (error) {
    console.error("Error al conectar con OpenRouter:", error);
    res.json({ reply: "Error conectando con la IA.", source: "error" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend de PanteaGroup conectado a OpenRouter.ai");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
