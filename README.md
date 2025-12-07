# 🚀 Velox

_A provably fair crash game platform with real-time shared gameplay._

## 📋 Overview

Velox is a crash game engine where all players participate in the same round and watch a shared multiplier rise in real time in their respective rooms. Players place bets and aim to cash out before the multiplier crashes—wait too long and the bet is lost. Every outcome is generated using a provably fair algorithm to ensure transparency and fairness.

**Status:** 🚧 Alpha — under active development.

_Where speed meets strategy._

## 🛠️ Tech Stack

### Frontend

- ⚛️ React
- 📘 TypeScript
- 🎨 shadcn/ui

### Backend

- 🟢 Node.js
- 📘 TypeScript
- 🔌 Socket.IO
- 🐘 PostgreSQL
- 🔴 Redis
- 🧪 Jest (Testing)

## 📁 Project Structure

```
velox/
├── backend/                    # Backend server and game logic
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/        # Request handlers
│   │   ├── database/           # Database setup and migrations
│   │   ├── jobs/              # Background jobs and queues
│   │   │   ├── queues/        # Queue definitions
│   │   │   └── workers/       # Worker processes
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types and interfaces
│   │   ├── utils/             # Helper functions
│   │   ├── websocket/         # Socket.IO handlers
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Server entry point
│   ├── test/                  # Test files
│   │   ├── unit/              # Unit tests
│   │   ├── integration/       # Integration tests
│   │   └── e2e/               # End-to-end tests
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.test.json
├── frontend/                    # React application and UI components
│   └── index.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- 📦 Node.js
- 🐘 PostgreSQL
- 🔴 Redis

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Configuration

### Backend

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/velox
REDIS_URL=redis://localhost:6379
PORT=3000
```

### Frontend

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## 🧪 Testing

Run tests using Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## ✨ Features

### 🎮 Gameplay

- ⚡ Real-time gameplay with low-latency WebSocket updates
- 🔐 Provably fair algorithm with verifiable outcomes
- 🎯 Multi-bet: place up to two bets per round
- 🤖 Autobet: automated betting
- 💰 Autocashout: automatic profit-taking
- 📱 Smooth UX/UI with responsive and mobile-friendly design

### 👥 Social & Community

- 💬 In-game chat system
- 🎁 Referral program with rewards
- 📊 Live top 20 stakers display
- 🏆 Leaderboards showcasing top players and biggest wins

### 🔒 Security & Payments

- 🔐 Secure authorization with login and registration
- 💳 Easy deposits and withdrawals via M-Pesa integration

## 📧 Contact

For questions, support, or inquiries:

- 📮 Email: brianwgatundu@gmail.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

Thanks to the open-source community for the amazing tools and libraries that made this project possible.

---

<p align="center">
  <em>Where speed meets strategy.</em><br>
  © 2025 Velox. Created by Brian Gatundu. All rights reserved.
</p>
