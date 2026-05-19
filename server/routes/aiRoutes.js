const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

// Initialize Groq SDK with key from environment variable
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Format history for Groq API
    const formattedMessages = [
      {
        role: "system",
        content: "You are CampusIntel AI Mentor. You help college students (especially juniors and first-generation college students) with placement strategies, academic advice, scholarship opportunities, club recruitments, and general college guidance. Be extremely supportive, knowledgeable, and provide actionable tips."
      }
    ];

    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        formattedMessages.push({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        });
      });
    }

    // Add current user message
    formattedMessages.push({
      role: "user",
      content: message
    });

    const completion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "llama-3.1-8b-instant", // Direct replacement for decommissioned llama3-8b-8192
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || "I am sorry, I couldn't formulate a response right now.";
    res.json({ reply });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ error: "Failed to connect to AI engine. Check if GROQ_API_KEY is configured in your server .env file." });
  }
});

// AI Quick Summarizer for Feed Posts (Extra Judge-Wow Feature)
router.post("/summarize", async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required for summary" });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a smart academic assistant. Summarize the following campus post description into exactly 3 very short, high-impact bullet points. Do NOT use any asterisks, markdown, or bold characters. Keep it under 60 words."
        },
        {
          role: "user",
          content: description
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 150
    });

    const summary = completion.choices[0]?.message?.content || "No summary available.";
    res.json({ summary });
  } catch (error) {
    console.error("Groq Summary Error:", error);
    res.status(500).json({ error: "Summary engine offline" });
  }
});

module.exports = router;
