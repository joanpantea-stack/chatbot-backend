import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "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"; // tu clave Hugging Face

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const hfRes = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: userMessage })
    });
    const data = await hfRes.json();
    res.json({ reply: data?.[0]?.generated_text || data?.generated_text || "Lo siento, no tengo información sobre eso." });
  } catch (err) {
    res.json({ reply: "Error conectando con la IA." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor IA activo en puerto ${PORT}`));
