const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const db = new Database(path.join(__dirname, "melbet.db"));
const PORT = 5000;
const JWT_SECRET = "melbet-secret-key-123";

app.use(cors());
app.use(express.json());

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS wallet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    balance REAL DEFAULT 0,
    bonus REAL DEFAULT 0,
    pending REAL DEFAULT 0,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    match_name TEXT,
    odd REAL,
    stake REAL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const matches = [
  { id: 1, sport: "Football", match: "Arsenal vs Chelsea", time: "18:45", home: 1.92, draw: 3.4, away: 3.8 },
  { id: 2, sport: "Football", match: "Real Madrid vs Barcelona", time: "20:00", home: 2.15, draw: 3.2, away: 3.25 },
  { id: 3, sport: "Basketball", match: "Lakers vs Celtics", time: "21:30", home: 1.9, draw: 2.8, away: 2.9 },
  { id: 4, sport: "Tennis", match: "Djokovic vs Medvedev", time: "22:00", home: 1.62, draw: 2.4, away: 2.8 },
  { id: 5, sport: "Esports", match: "G2 vs Fnatic", time: "Live", home: 1.58, draw: 2.2, away: 3.5 },
  { id: 6, sport: "Cricket", match: "India vs Australia", time: "13:30", home: 1.83, draw: 2.7, away: 2.1 },
];

const getToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/", (req, res) => {
  res.json({ message: "Melbet API is running" });
});

app.get("/api/matches", (req, res) => {
  res.json(matches);
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const exists = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = db.prepare(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
  ).run(name, email, hashedPassword);

  const user = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(result.lastInsertRowid);

  const walletRow = db.prepare("SELECT * FROM wallet WHERE user_id = ?").get(user.id);
  if (!walletRow) {
    db.prepare("INSERT INTO wallet (user_id, balance, bonus, pending) VALUES (?, 12450, 2230, 380)").run(user.id);
  }

  const token = getToken(user);

  res.status(201).json({ token, user });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const safeUser = { id: user.id, name: user.name, email: user.email };
  const token = getToken(safeUser);

  res.json({ token, user: safeUser });
});

app.get("/api/wallet/:userId", authMiddleware, (req, res) => {
  const wallet = db.prepare("SELECT * FROM wallet WHERE user_id = ?").get(req.params.userId);
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  res.json({
    balance: wallet.balance,
    bonus: wallet.bonus,
    pending: wallet.pending,
  });
});

app.get("/api/bets/:userId", authMiddleware, (req, res) => {
  const bets = db.prepare("SELECT * FROM bets WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
  res.json(bets);
});

app.post("/api/bets", authMiddleware, (req, res) => {
  const { userId, matchName, odd, stake } = req.body;

  if (!userId || !matchName || !odd || !stake) {
    return res.status(400).json({ message: "Missing bet data" });
  }

  const walletRow = db.prepare("SELECT * FROM wallet WHERE user_id = ?").get(userId);
  if (!walletRow) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  const newBalance = walletRow.balance - Number(stake);

  db.prepare(`
    UPDATE wallet
    SET balance = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).run(newBalance, userId);

  const result = db.prepare(`
    INSERT INTO bets (user_id, match_name, odd, stake, status)
    VALUES (?, ?, ?, ?, 'pending')
  `).run(userId, matchName, odd, stake);

  res.status(201).json({
    id: result.lastInsertRowid,
    message: "Bet placed successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
