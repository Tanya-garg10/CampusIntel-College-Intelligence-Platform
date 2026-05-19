require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testSummary() {
  try {
    console.log("Testing Summarizer API directly with Groq...");
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a smart academic assistant. Summarize the following campus post description into exactly 3 very short, high-impact bullet points. Do NOT use any asterisks, markdown, or bold characters. Keep it under 60 words."
        },
        {
          role: "user",
          content: "TCS NQT registration is officially open for 2026 batch candidates. Eligible branches: CSE, IT, ECE, EE with no active backlogs and minimum 60% throughout 10th, 12th, and Graduation. The test will evaluate Cognitive Skills and Coding Abilities. Last date to apply is October 15, 2026."
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 150
    });

    console.log("SUCCESS!");
    console.log("Summary Output:\n", completion.choices[0]?.message?.content);
  } catch (error) {
    console.error("ERROR:");
    console.error(error);
  }
}

testSummary();
