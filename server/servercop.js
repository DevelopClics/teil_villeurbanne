const jsonServer = require("json-server");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const SECRET_KEY = "your-very-secret-key";
const expiresIn = "1h";

server.use(cors());
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Auth middleware: allow some routes public, protect others
server.use((req, res, next) => {
  if (req.path === "/login") {
    return next();
  }

  // Public GET routes
  if (
    req.method === "GET" &&
    (req.path.startsWith("/carouselText") ||
      req.path.startsWith("/genesisText") ||
      req.path.startsWith("/reasonText") ||
      req.path.startsWith("/teammembers") ||
      req.path.startsWith("/carouselImages"))
  ) {
    return next();
  }

  // For other requests: check auth header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Login route
server.post("/login", (req, res) => {
  const { id, password } = req.body;
  const db = router.db; // lowdb instance
  const user = db.get("user").value();

  if (!user || user.id !== id) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  bcrypt.compare(password, user.password).then((isMatch) => {
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn,
    });
    res.json({ token });
  });
});

// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Upload route
server.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server running on port ${PORT}`);
});
