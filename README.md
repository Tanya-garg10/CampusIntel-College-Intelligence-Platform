# 🚀 CampusIntel – AI-Powered Institutional Intelligence Platform

An advanced **AI-Powered "Institutional Intelligence Network"** designed to democratize hidden college knowledge. It helps college students (especially juniors and first-generation students) discover academic strategies, placement insights, scholarship opportunities, and clubs through verified peer intelligence, predictive urgency alerts, dynamic profile gamification, and an interactive **Llama 3.1 AI Mentor**.

## 🎯 Core Features

### 1. 🧠 AI Campus Mentor (`/ai-mentor`)
* **Real-time Academic Coaching**: An interactive chatbot powered by **Groq's Llama 3.1 (8B-Instant)** model acting as a supportive senior mentor.
* **Smart Markdown Parser**: Includes a custom-built, zero-dependency markdown compiler rendering clean, structured lists, bold headers, and structured points inside chat bubbles.

### 2. ⚡ AI-Powered Opportunity Summarizer (`/feed`)
* **One-Click Analysis**: Integrated a **"Sparkles" AI Summarize** button on opportunity cards.
* **Sleek Highlight Bubbles**: Dynamically invokes Groq Llama 3.1 to generate exactly 3 key highlights in under 60 words, rendering inside a glowing glassmorphism highlights card immediately.

### 3. 🔐 Smart Authentication & Dual Emails (`/login`)
* **Firebase Auth Integration**: Full client-side authentication with strict validation rules.
* **Auto-Verification Logic**: Preferred `@college.edu` emails for auto-verified senior credentials, with an optional toggle for personal email fallbacks.

### 4. 📢 Real-Time Intelligence Feed (`/feed` & `/add-post`)
* **MongoDB-Free Firestore Setup**: Fully migrated all database structures to **Cloud Firestore** for direct client-side CRUD operations.
* **Instant Feed Synchronization**: Powered by real-time `onSnapshot` listeners. As soon as a user broadcasts an opportunity or upvotes, the feed updates **instantly** without page reloads!
* **Urgency Coding**: Dynamic color-coded priority badges based on academic urgency levels (High, Medium, Low).

### 5. 🕵️ Incognito Student Broadcasting
* **Anonymous Toggle**: Seniors can broadcast sensitive placements, exam vivas, or club leaks anonymously to prevent tracking.
* **Incognito badges**: Cards display a beautiful yellow **Anonymous Contributor** shield warning icon on the Feed.

### 6. 🏆 Gamified Student Dashboard (`/dashboard`)
* **Edit Profile Drawer**: Beautiful glassmorphic popup modal allowing students to update their skills, branch, college, and social handles in Firestore.
* **Active Event Logger**: Custom listener tracking user clicks (e.g. "Upvoted TCS", "Bookmarked Google Scholarship") displaying them in a live activity tracker.
* **Achievement Badges**: Clickable locked/unlocked milestone badges with custom explanatory popup modals.
* **Dynamic Bookmarks List**: Collects saved opportunities in local storage and manages deletion.

### 7. 📅 Smart Timeline Calendar (`/calendar`)
* **Vertical Timeline**: Visually presents placement events, GDSC study jams, and exam dates.
* **Interactive Google Sync**: Live sync simulation featuring a spinning loader (`Syncing...`) and a stunning green success alert banner.

## 🛠️ Technology Stack

| Layer | Technology | Key Use Case |
|---|---|---|
| **Frontend** | React (Vite) | Blazing-fast responsive single-page architecture |
| **Styling** | Vanilla CSS | Custom Premium Glassmorphic design system |
| **Auth** | Firebase Auth | Strict signup validation, dual-email validation |
| **Database** | Firebase Cloud Firestore | Real-time listeners (`onSnapshot`), instant updates |
| **Backend API** | Node.js + Express | Dedicated AI Microservice to secure API keys |
| **LLM Engine** | Groq Cloud SDK | Blazing fast `llama-3.1-8b-instant` responses |
| **Icons** | Lucide React | Clean, modern visual representations |


## 🚀 Installation & Local Setup

### Prerequisites
* **Node.js** (v16+ recommended)
* **Firebase Project** configured with Web App + Firestore DB Enabled.
* **Groq API Key** (from [console.groq.com](https://console.groq.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/Tanya-garg10/CampusIntel-College-Intelligence-Platform.git
cd CampusIntel-College-Intelligence-Platform
```

### 2. Configure Backend (`/server`)
1. Create a `server/.env` file:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=5000
   ```
2. Start the Express server:
   ```bash
   cd server
   npm install
   npm start
   ```

### 3. Configure Frontend (`/client`)
1. Add your Firebase credentials inside `client/src/firebase.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
2. Enable **Email/Password Authentication** in your Firebase console.
3. Start the Vite React app:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 👨‍💻 Contributing

1. Fork this repository.
2. Create a feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Create a Pull Request.

*Made with ❤️ for Hackathons. CampusIntel democratizes student success!*
