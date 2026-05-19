require("dotenv").config();
const Groq = require("groq-sdk");

console.log("API Key loaded:", process.env.GROQ_API_KEY ? "YES" : "NO");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: "Hello, this is a test from CampusIntel." }
      ],
      model: "llama-3.1-8b-instant",
    });
    console.log("SUCCESS!");
    console.log("Reply:", completion.choices[0]?.message?.content);
  } catch (error) {
    console.error("ERROR OCCURRED:");
    console.error(error);
  }
}

test();
