require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 


let messages = [];


app.get("/api/hello", (req, res) => {
  res.json(messages);
});


app.post("/api/hello", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Message text is required" });
  }

  const newMessage = { text, id: messages.length + 1 };
  messages.push(newMessage);

  res.status(201).json(newMessage);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});