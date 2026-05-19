require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Setup AI Groq endpoints only (MongoDB removed, Database logic moved to direct Firestore frontend)
app.use("/api/ai", require("./routes/aiRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Express AI Server running on port ${PORT}`));
