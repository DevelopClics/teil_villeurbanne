// server.js
console.log("Running server.js from:", __filename);

require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

const jsonServer = require("json-server");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs").promises;
const express = require("express");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

if (!process.env.SECRET_KEY) {
  console.error(
    "FATAL ERROR: SECRET_KEY is not defined in the environment variables."
  );
  process.exit(1);
}

const SECRET_KEY = process.env.SECRET_KEY;
const expiresIn = "1h";
const PORT = process.env.PORT || 4040;

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);
server.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === Helper JWT ===
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// === Helper safe unlink ===
async function safeUnlink(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`Successfully deleted file: ${filePath}`);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Failed to delete file: ${filePath}`, err);
    }
  }
}

// === AUTH MIDDLEWARE ===
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Insufficient privileges." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token." });
  }
};

// === LOGIN ===
server.post("/login", async (req, res) => {
  const { id, password } = req.body;
  const user = router.db.get("user").find({ id }).value();
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = createToken({ id: user.id, role: user.role });
  res.status(200).json({ token });
});

// === Base upload path ===
const uploadBasePath = path.join(__dirname, "uploads");

// === MULTER STORAGE SETUP ===
const createStorage = (subfolder, useCategory = false) =>
  multer.diskStorage({
    destination: async (req, file, cb) => {
      let folderPath = [uploadBasePath, subfolder];
      if (useCategory) {
        const category = req.body.category || req.params.category;
        if (category) {
          folderPath.push(category);
        } else if (subfolder === 'projects') {
          folderPath.push('uncategorized');
        }
      }
      const dest = path.join(...folderPath);
      try {
        await fs.mkdir(dest, { recursive: true });
        cb(null, dest);
      } catch (err) {
        cb(err);
      }
    },
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });

// --- CAROUSEL ---
const carouselUpload = multer({ storage: createStorage("carousel") });

server.post("/upload/carousel", authMiddleware, carouselUpload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded." });
  res.json({ src: `/uploads/carousel/${req.file.filename}` });
});

server.delete("/carouselImages/:category/:id", authMiddleware, async (req, res) => {
  const { category, id } = req.params;
  const db = router.db;
  const carouselImages = db.get("carouselImages").value();

  if (!carouselImages[category])
    return res.status(404).json({ message: "Carousel category not found" });

  const slideToDelete = carouselImages[category].find((s) => s.id == id);
  if (!slideToDelete)
    return res.status(404).json({ message: "Slide not found" });

  if (slideToDelete.src?.startsWith("/uploads/")) {
    const imagePath = path.join(__dirname, slideToDelete.src);
    await safeUnlink(imagePath);
  }

  carouselImages[category] = carouselImages[category].filter((s) => s.id != id);
  db.set("carouselImages", carouselImages).write();

  res.status(204).send();
});

// --- TEAM MEMBERS ---
const teamMemberUpload = multer({ storage: createStorage("team", true) });

server.delete("/teammembers/:category/:id", authMiddleware, async (req, res) => {
  const { category, id } = req.params;
  const db = router.db;
  const teamMembers = db.get("teammembers").value();

  if (!teamMembers[category])
    return res.status(404).json({ message: "Category not found" });

  const memberToDelete = teamMembers[category].find((m) => m.id == id);
  if (!memberToDelete)
    return res.status(404).json({ message: "Team member not found" });

  if (memberToDelete.src) {
    const imagePath = path.join(__dirname, memberToDelete.src);
    await safeUnlink(imagePath);
  }

  teamMembers[category] = teamMembers[category].filter((m) => m.id != id);
  db.set("teammembers", teamMembers).write();

  res.status(204).send();
});

server.post("/teammembers/:category", authMiddleware, (req, res) => {
  const { category } = req.params;
  const db = router.db;
  const teamMembers = db.get("teammembers").value();

  if (!teamMembers[category])
    return res.status(404).json({ message: "Category not found" });

  const newId =
    teamMembers[category].length > 0
      ? Math.max(...teamMembers[category].map((m) => m.id)) + 1
      : 1;

  const newMember = { id: newId, ...req.body };
  teamMembers[category].push(newMember);
  db.set("teammembers", teamMembers).write();

  res.status(201).json(newMember);
});

server.put("/teammembers/:category/:id", authMiddleware, (req, res) => {
  const { category, id } = req.params;
  const db = router.db;
  const teamMembers = db.get("teammembers").value();

  if (!teamMembers[category])
    return res.status(404).json({ message: "Category not found" });

  const index = teamMembers[category].findIndex((m) => m.id == id);
  if (index === -1)
    return res.status(404).json({ message: "Team member not found" });

  teamMembers[category][index] = {
    ...teamMembers[category][index],
    ...req.body,
  };
  db.set("teammembers", teamMembers).write();

  res.json(teamMembers[category][index]);
});

server.post(
  "/upload/:category",
  authMiddleware,
  teamMemberUpload.single("image"),
  (req, res) => {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded." });
    const category = req.params.category;
    const fileUrl = `/uploads/team/${category}/${req.file.filename}`;
    res.json({ url: fileUrl });
  }
);

// --- PROJECTS ---
const projectUpload = multer({ storage: createStorage("projects", true) });

server.post("/projects", authMiddleware, projectUpload.single("image"), (req, res) => {
  const db = router.db;
  const projects = db.get("projects");
  const allProjects = projects.value();

  const maxOrder = allProjects.reduce(
    (max, p) => Math.max(max, p.displayOrder || 0),
    0
  );

  const newProject = {
    id: Date.now().toString(),
    ...req.body,
    src: req.file
      ? `/uploads/projects/${req.body.category || "uncategorized"}/${
          req.file.filename
        }`
      : req.body.src,
    displayOrder: maxOrder + 1,
  };

  projects.push(newProject).write();
  res.status(201).json(newProject);
});

server.put("/projects/:id", authMiddleware, projectUpload.single("image"), async (req, res) => {
  const db = router.db;
  const { id } = req.params;
  const project = db.get("projects").find({ id });

  if (!project.value())
    return res.status(404).json({ message: "Project not found" });

  if (req.file && project.value().src) {
    const oldPath = path.join(__dirname, project.value().src);
    await safeUnlink(oldPath);
  }

  const updatedProject = {
    ...project.value(),
    ...req.body,
    src: req.file
      ? `/uploads/projects/${req.body.category || "uncategorized"}/${
          req.file.filename
        }`
      : project.value().src,
  };

  project.assign(updatedProject).write();
  res.status(200).json(updatedProject);
});

server.delete("/projects/:id", authMiddleware, async (req, res) => {
  const db = router.db;
  const { id } = req.params;
  const project = db.get("projects").find({ id });

  if (!project.value())
    return res.status(404).json({ message: "Project not found" });

  if (project.value().src) {
    const imagePath = path.join(__dirname, project.value().src);
    await safeUnlink(imagePath);
  }

  db.get("projects").remove({ id }).write();
  res.status(204).send();
});

// --- PROJECT REORDER ---
const reorderProject = (projects, projectToMove, newOrder) => {
  const oldOrder = projectToMove.displayOrder;
  projects.forEach((p) => {
    if (p.id !== projectToMove.id) {
      if (p.displayOrder >= newOrder && p.displayOrder < oldOrder)
        p.displayOrder += 1;
      else if (p.displayOrder <= newOrder && p.displayOrder > oldOrder)
        p.displayOrder -= 1;
    }
  });
  projectToMove.displayOrder = newOrder;
  projects.sort((a, b) => a.displayOrder - b.displayOrder);
};

server.patch("/projects/:id/move_to_top", authMiddleware, (req, res) => {
  const db = router.db;
  const projects = db.get("projects").value();
  const project = projects.find((p) => p.id == req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  reorderProject(projects, project, 1);
  db.write();
  res.json(projects);
});

server.patch("/projects/:id/move_up", authMiddleware, (req, res) => {
  const db = router.db;
  const projects = db.get("projects").value();
  const project = projects.find((p) => p.id == req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (project.displayOrder === 1)
    return res.status(400).json({ message: "Already at top" });
  reorderProject(projects, project, project.displayOrder - 1);
  db.write();
  res.json(projects);
});

server.patch("/projects/:id/move_down", authMiddleware, (req, res) => {
  const db = router.db;
  const projects = db.get("projects").value();
  const project = projects.find((p) => p.id == req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  const maxOrder = Math.max(...projects.map((p) => p.displayOrder));
  if (project.displayOrder === maxOrder)
    return res.status(400).json({ message: "Already at bottom" });
  reorderProject(projects, project, project.displayOrder + 1);
  db.write();
  res.json(projects);
});

// --- PLACES ---
const placesUpload = multer({ storage: createStorage("places") });

server.post(
  "/places/:id/upload",
  authMiddleware,
  placesUpload.single("image"),
  async (req, res) => {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded." });

    const { id } = req.params;
    const db = router.db;
    const place = db.get("places").find({ id: parseInt(id, 10) });

    if (!place.value())
      return res.status(404).json({ message: "Place not found" });

    if (place.value().src) {
      const oldPath = path.join(__dirname, place.value().src);
      await safeUnlink(oldPath);
    }

    const fileUrl = `/uploads/places/${req.file.filename}`;
    const updatedPlace = {
      ...place.value(),
      src: fileUrl,
      cacheBust: Date.now(),
    };
    place.assign(updatedPlace).write();
    res.status(200).json(updatedPlace);
  }
);

server.delete("/places/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const place = db.get("places").find({ id: parseInt(id, 10) });
  if (!place.value())
    return res.status(404).json({ message: "Place not found" });

  if (place.value().src) {
    const imagePath = path.join(__dirname, place.value().src);
    await safeUnlink(imagePath);
  }

  db.get("places")
    .remove({ id: parseInt(id, 10) })
    .write();
  res.status(204).send();
});

// --- HEALTH CHECK ---
server.get("/health", (req, res) => res.sendStatus(200));

// --- JSON SERVER ROUTER ---
server.use(router);

// --- START SERVER ---
const serverInstance = server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `✅ JSON Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );

  // Initialize displayOrder for projects
  const db = router.db;
  const projects = db.get("projects").value();
  let needsUpdate = false;
  const sorted = projects.sort(
    (a, b) => new Date(a.subtitle) - new Date(b.subtitle)
  );
  sorted.forEach((p, idx) => {
    if (p.displayOrder !== idx + 1) {
      p.displayOrder = idx + 1;
      needsUpdate = true;
    }
  });
  if (needsUpdate) {
    db.get("projects").assign(sorted).write();
    console.log("✅ Initialized displayOrder for projects");
  }
});

serverInstance.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Exiting...`);
    process.exit(1);
  } else {
    console.error("❌ Server error:", err);
  }
});
