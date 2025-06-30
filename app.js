import express from "express";
import path from "path";
import { readFile } from "fs/promises";

export const app = express();

const __dirname = import.meta.dirname;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 取得
app.get("/api/flashcards", async (req, res) => {
  const flashcardsJsonPath = path.join(__dirname, "data", "flashcards.json");
  const data = await readFile(flashcardsJsonPath, "utf-8");
  const flashcardsList = JSON.parse(data);
  res.json(flashcardsList);
});
