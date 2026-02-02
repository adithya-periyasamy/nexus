# Nexus 🤖

**Empower Your Ideas with Intelligent Agents**

Welcome to **Nexus**, a platform designed to make building AI agents simple, intuitive, and powerful. Whether you need a smart chatbot, a task automation helper, or a complex workflow manager, Nexus gives you the tools to bring your agents to life without getting lost in code. 

Think of it as a creative studio where you can visually design how your AI thinks and acts.

---

## 🛠️ Tech Stack (Under the Hood)

We use modern, robust technologies to ensure Nexus is fast, reliable, and smart. Here's a simple breakdown:

- **The Brains (Framework):** [Next.js](https://nextjs.org/) - The engine that powers the entire application.
- **The Logic (Language):** [TypeScript](https://www.typescriptlang.org/) - Ensures our code is safe and error-free.
- **The Look (Styling):** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) - For a beautiful, sleek, and responsive design.
- **The Memory (Database):** [Neon](https://neon.tech/) (PostgreSQL) & [Drizzle ORM](https://orm.drizzle.team/) - Securely stores your agents and data.
- **The Intelligence (AI):** Powered by **Google Gemini** & **OpenAI** via the [Vercel AI SDK](https://sdk.vercel.ai/docs).
- **The Workflow (Visuals):** [React Flow](https://reactflow.dev/) - The drag-and-drop interface for building agent logic.
- **Security:** [Arcjet](https://arcjet.com/) - Keeps the platform safe from attacks.

---

## 🚀 Getting Started

Follow these simple steps to get Nexus running on your local machine.

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Clone & Install
Open your terminal in the project folder and run:
```bash
npm install
```
This installs all the necessary "parts" (dependencies) for the app to work.

### 3. Set Up Environment Variables
You need to provide some secret keys (like for the database and AI models) for the app to function.
1. Create a new file named `.env.local` in the root folder.
2. Copy the contents from `.env.example` into it.
3. Fill in your API keys (Google Gemini, database URL, etc.).

### 4. Set Up the Database
Get your database ready to store information:
```bash
npm run db:push
```

### 5. Run the App
Launch the development server:
```bash
npm run dev
```
Once it starts, open your browser and go to `http://localhost:3000` to see Nexus in action!

---

*Built with ❤️ by [Adithya P.](https://www.linkedin.com/in/adithya-periyasamy)*
