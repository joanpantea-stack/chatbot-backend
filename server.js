// ============================================
// 🔹 Servidor Backend IA - Panteagroup
// ============================================
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.HUGGINGFACE_API_KEY || "";
if (!API_KEY) {
  console.warn("⚠️ No hay API_KEY configurada. Añádela en Render como HUGGINGFACE_API_KEY");
}


// 🔹 Endpoint principal IA
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Mensaje vacío" });

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

    const data = await response.json();
    const reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      "Lo siento, no tengo información sobre eso.";

    res.json({ reply });
  } catch (error) {
    console.error("Error al conectar con IA:", error);
    res.json({ reply: "Error conectando con la IA." });
  }
});

app.get("/", (_, res) => {
  res.send("✅ Servidor IA de Panteagroup operativo.");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
