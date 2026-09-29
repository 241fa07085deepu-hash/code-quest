# Code Quest - Learn Python & DSA Through Games 🎮🐍

An interactive, gamified full-stack platform designed to teach Python programming and fundamental Data Structures & Algorithms (DSA) through hands-on coding challenges and real-time visual mini-games.

![Code Quest Preview](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

- **10 Core Python & DSA Modules**:
  1. *Basics & Variables* - Crystal Core Energizer
  2. *Conditionals & Logic* - Dungeon Gatekeeper
  3. *Loops & Iteration* - Mana Forge Overdrive
  4. *Lists & Arrays* - Inventory Optimizer
  5. *Two Pointers Technique* - Dual Laser Targeter
  6. *Stacks (LIFO)* - Tower Spell Reverser
  7. *Queues (FIFO)* - Raid Party Matchmaker
  8. *Binary Search* - Quantum Archive Scanner
  9. *Trees & Traversal* - Eldertree Branch Explorer
  10. *Dynamic Programming* - Dungeon Treasure Path

- **Interactive Code Editor & Real-Time Test Runner**:
  - In-browser Python sandbox execution
  - Real-time unit test validation with edge cases
  - Visual terminal outputs with colored diffs and error tracebacks

- **Interactive Visual Game Boards**:
  - Dynamic game state animations reflecting your code logic
  - Canvas confetti particle effects upon completion

- **Authentication & User Profiles**:
  - Role-based access control (Students & Admins)
  - XP progression, levels, daily streaks, and achievement badges
  - Pre-seeded student and instructor test accounts

- **Full MongoDB Persistence**:
  - Official Node.js `mongodb` driver integration
  - Dual-mode architecture: connects to live MongoDB Atlas or automatically operates seamlessly via persistent local document storage (`data/mongodb_store.json`)
  - Admin inspection panel with raw JSON viewer, live collection stats, and 1-click database reset

- **Leaderboards & Analytics**:
  - Global student leaderboard ranked by XP and completed quests
  - Admin monitoring dashboard for submission pass rates, active users, and code history

- **API Documentation & Postman Support**:
  - Pre-built Postman collection (v2.1) exportable at `/api/docs/postman-collection`

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, TSX
- **Database**: MongoDB (Official Node.js Driver) with automatic embedded fallback
- **Tooling**: Vite, TypeScript compiler (`tsc`)

---

## 🛠️ Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
> *Note: If `MONGODB_URI` is omitted, the project automatically uses the built-in persistent local MongoDB store without any external setup needed!*

### 4. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the API via Postman

1. Open Postman.
2. Click **Import** and paste:
   ```
   http://localhost:3000/api/docs/postman-collection
   ```
   *(or `https://<your-deployed-domain>/api/docs/postman-collection`)*
3. Explore the pre-configured requests for Authentication, Quests, Submissions, Leaderboards, and Admin APIs.

---

## 🔑 Demo Credentials

- **Admin Account**:
  - Email: `admin@codequest.dev`
  - Password: `admin123`
- **Student Account**:
  - Email: `student@codequest.dev`
  - Password: `student123`

---

## 📜 Available Scripts

- `npm run dev` - Starts the full-stack Express + Vite server
- `npm run build` - Builds production bundle into `dist`
- `npm run lint` - Validates TypeScript types and syntax
- `npm run start` - Runs the production server

---

## 📄 License
MIT
