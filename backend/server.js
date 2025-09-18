require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let messages = [];

// GET /api/hello ดึงข้อความทั้งหมด
app.get("/api/hello", (req, res) => {
  res.json(messages);
});

// POST /api/hello เพิ่มข้อความ
app.post("/api/hello", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Message is required" });
  const newMessage = { id: messages.length + 1, text };
  messages.push(newMessage);
  res.json(newMessage);
});

// PUT /api/hello/:id แก้ข้อความ
app.put("/api/hello/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { text } = req.body;
  const msg = messages.find((m) => m.id === id);
  if (!msg) return res.status(404).json({ error: "Message not found" });
  msg.text = text;
  res.json(msg);
});

// DELETE /api/hello/:id ลบข้อความ
app.delete("/api/hello/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) return res.status(404).json({ error: "Message not found" });
  const deleted = messages.splice(index, 1);
  res.json(deleted[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
