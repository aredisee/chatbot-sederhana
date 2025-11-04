import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Setup client OpenAI ke Hugging Face router
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Halaman utama
app.get("/", (req, res) => {
  res.render("index");
});

// Endpoint chat
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.1-8B-Instruct:novita", // kamu bisa ganti ke model lain
      messages: [{ role: "user", content: userMessage }],
    });

    const botReply = completion.choices[0].message.content || "Tidak ada balasan.";
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error:", error);
    res.json({ reply: "Terjadi kesalahan di server." });
  }
});

// Jalankan server
app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));
