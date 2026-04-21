# 💸 AI Expense Tracker (GenAI + TypeScript)

An intelligent expense tracking application powered by **Generative AI** and built with a modern full-stack TypeScript architecture.

This app helps users manage their finances, categorize expenses automatically, and gain insights using AI.

## 🚀 Features

* 🤖 AI-powered expense categorization (GenAI)
* 📊 Visual analytics with charts
* 🔐 Secure authentication system
* 🌙 Dark/Light theme support
* 📅 Date-based expense tracking
* 🧾 Smart expense management (add, edit, delete)
* ⚡ Fast and responsive UI (Next.js + React 19)

## 📸 Demo Images

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1xaAuMWMsTFmazstFHEdqEhVtc--PLaY0" width="45%" />
  <img src="https://drive.google.com/uc?export=view&id=1n9PfdXBC9UW94xCId81kLRB26rXQRLrr" width="45%" />
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1S_lIqc9RHQDu8WX4bPkjTZuGZWOlEQyE" width="45%" />
  <img src="https://drive.google.com/uc?export=view&id=1c1thDPFuaeTH_gYKSEcmYQVOYrQqG_eL" width="45%" />
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1CIpbBanqNztc5TlyIcTCvLnGeCvHDv0K" width="45%" />
  <img src="https://drive.google.com/uc?export=view&id=12UR_le1ybA_4_SW_Q5cf0Fc0Gtih3sqX" width="45%" />
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1dQWFPZjsK-fdW6HXssNgifWLz3wEE2v3" width="45%" />
</p>

## 🏗️ Tech Stack

### Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* Redux Toolkit
* Radix UI
* Recharts (for data visualization)

### Backend

* Node.js + Express
* TypeScript
* Prisma ORM
* PostgreSQL (or any Prisma-supported DB)
* JWT Authentication
* Zod (validation)

### AI / GenAI

* GenAI integration for:

  * Expense classification
  * Insights generation
  * Smart suggestions

---

## 📁 Project Structure

```
expense-tracker/
│
├── frontend/        # Next.js app
│   ├── app/
│   ├── components/
│   ├── redux/
│   └── utils/
│
├── backend/         # Express API
│   ├── src/
│   ├── prisma/
│   └── dist/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

---

### 2️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

### 3️⃣ Setup Backend

```bash
cd backend
npm install
```

#### Setup environment variables

Create a `.env.development` file:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
```

---

### 4️⃣ Prisma Setup

Run the following commands:

```bash
npm run prisma:dev:generate
npm run prisma:dev:push
```

---

### 5️⃣ Start Backend Server

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## 🧠 How AI Works (Simple Explanation)

1. User adds an expense (e.g., "₹500 for pizza")
2. The app sends this text to a GenAI model
3. AI analyzes the text and:

   * Detects category (Food 🍕)
   * Suggests tags or insights
4. The result is stored and visualized

---

## 📊 Example Workflow

* Add expense → "Uber ride ₹200"
* AI detects → Transport 🚕
* Data stored in DB
* Chart updates automatically

---

## 🔐 Authentication

* Uses JWT-based authentication
* Passwords are hashed using bcrypt
* Secure APIs with rate limiting & helmet

---

## 🧪 Scripts

### Frontend

```bash
npm run dev       # Start dev server
npm run build     # Build app
npm run start     # Start production
npm run lint      # Lint code
```

### Backend

```bash
npm run dev                # Start dev server
npm run build              # Compile TypeScript
npm run start              # Run production build
npm run prisma:dev:push    # Push schema to DB
npm run prisma:dev:generate # Generate Prisma client
```

---

## 🛡️ Security Features

* Rate limiting (prevents abuse)
* Helmet (secure HTTP headers)
* Input validation (Zod)
* Password hashing (bcrypt)

---

## 📌 Future Improvements

* 📱 Mobile app (React Native)
* 🔔 Smart notifications
* 📈 Advanced AI insights (spending habits)
* 🌍 Multi-currency support
* 🧾 Receipt scanning with OCR + AI
