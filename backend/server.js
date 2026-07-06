import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HF_TOKEN = process.env.HF_TOKEN;
//const HF_MODEL = process.env.HF_MODEL || "Qwen/Qwen2.5-Coder-32B-Instruct";
const HF_PROVIDER = process.env.HF_PROVIDER || "auto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const hf = new InferenceClient(HF_TOKEN);

const modos={
    "web":"Eres un profesor de desarrollo web, responde con ejemplos y de forma clara para los estudiantes",
    "english":"Eres un profesor de inglés, proporciona ejemplos claros y fáciles",
    "debug":"Eres un desarrollador Senior con experiencia en resolver bugs de Node.js, da una solución eficaz, eficiente y con explicación"
}

const modelos={
    "meta":"meta-llama/Llama-3.1-8B-Instruct",
    "mistralai":"mistralai/Mistral-7B-Instruct-v0.3",
    "qwen3-8B":"Qwen/Qwen3-8B",
    "deepseek":"deepseek-ai/DeepSeek-R1",
    "gemma":"google/gemma-3-12b-it",
    "phi":"microsoft/Phi-4",
    "tiny":"TinyLlama/TinyLlama-1.1B-Chat-v1.0"
}
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Backend funcionando",
    model: "SELECCIONADO POR EL USUARIO",
    provider: HF_PROVIDER
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!HF_TOKEN) {
      return res.status(500).json({
        error: "Falta HF_TOKEN en el archivo .env"
      });
    }

    const { messages,modo,modelo } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Debes enviar un arreglo messages con al menos un mensaje."
      });
    }

    const safeMessages = messages
      .filter(m => m && typeof m.content === "string")
      .map(m => ({
        role: ["system", "user", "assistant"].includes(m.role) ? m.role : "user",
        content: m.content.slice(0, 3000)
      }))
      .slice(-10);

    const modoSeleccionado=modos[modo]
    const modeloSeleccionado=modelos[modelo]
      console.log(modoSeleccionado)
      console.log(modeloSeleccionado)
    const response = await hf.chatCompletion({
      model: modeloSeleccionado,
      messages: [
        {
          role: "system",
          content: modoSeleccionado
        },
        ...safeMessages
      ],
      max_tokens: 500,
      temperature: 0.7,
      extra: {
        provider: HF_PROVIDER
      }
    });

    const answer = response.choices?.[0]?.message?.content || "No se recibió respuesta del modelo.";

    res.json({ answer });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    res.status(500).json({
      error: "No se pudo generar la respuesta.",
      detail: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});