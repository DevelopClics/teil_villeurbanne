console.log("server.js is running");
const jsonServer = require("json-server");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const SECRET_KEY = "your-very-secret-key";
const expiresIn = "1h";

server.use(cors()); // Moved here
server.use(jsonServer.bodyParser); // Moved here

// Create JWT token
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Login route
server.post("/login", (req, res) => {
  const { id, password } = req.body;
  const user = router.db.get("user").find({ id }).value();

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  bcrypt.compare(password, user.password).then((isMatch) => {
    if (isMatch) {
      const token = createToken({ id: user.id, role: user.role });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

server.use(middlewares);

// Multer setup for dynamic team member file uploads
const teamUploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.params.category;
    const dest = path.join(
      __dirname,
      "..",
      "client",
      "public",
      "images",
      "photos",
      "team",
      category
    );
    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, dest);
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const teamUpload = multer({ storage: teamUploadStorage });

// Upload route for team member images by category
server.post("/upload/:category", teamUpload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  const fileUrl = `images/photos/team/${req.params.category}/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Authentication middleware
server.use((req, res, next) => {
  console.log("Request Path:", req.path);
  const publicPaths = ["/login"];

  const publicGetPaths = [
    "/login",
    "/places",
    "/citiesProjects",
    "/cultureProjects",
    "/foodProjects",
    "/youthProjects",
    "/economyProjects",
    "/carouselText/:id",
    "/reasonText/:id",
    "/genesisText/:id",
    "/pageTitles/:id",
    "/pageParagraphs/:id",
    "/carouselImages",
    "/teammembers",
    "/projects",
  ];

  if (req.method === "GET") {
    const isPublicGetPath = publicGetPaths.some((p) => {
      const regex = new RegExp(`^${p.replace(/\/:[^/]+/g, "/[^/]+")}$`);
      return regex.test(req.path);
    });
    if (isPublicGetPath) {
      return next();
    }
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Explicit routes for projects that were returning 404

server.get("/citiesProjects", (req, res) => {
  const citiesProjects = router.db.get("citiesProjects").value();
  res.json(citiesProjects);
});

server.get("/cultureProjects", (req, res) => {
  const cultureProjects = router.db.get("cultureProjects").value();
  res.json(cultureProjects);
});

server.get("/foodProjects", (req, res) => {
  const foodProjects = router.db.get("foodProjects").value();
  res.json(foodProjects);
});

server.get("/youthProjects", (req, res) => {
  const youthProjects = router.db.get("youthProjects").value();
  res.json(youthProjects);
});

server.get("/economyProjects", (req, res) => {
  const economyProjects = router.db.get("economyProjects").value();
  res.json(economyProjects);
});

server.put("/cultureProjects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedContent = req.body.content;
  const cultureProject = router.db
    .get("cultureProjects")
    .find({ id })
    .assign({ description: updatedContent })
    .write();
  if (cultureProject) {
    res.json(cultureProject);
  } else {
    res.status(404).json({ message: "Culture project not found" });
  }
});

// Routes for carousel text
server.get("/carouselText/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const carouselText = router.db.get("carouselText").find({ id }).value();
  if (carouselText) {
    res.json(carouselText);
  } else {
    res.status(404).json({ message: "Carousel text not found" });
  }
});

server.put("/carouselText/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const carouselText = router.db
    .get("carouselText")
    .find({ id })
    .assign({ title, content })
    .write();
  if (carouselText) {
    res.json(carouselText);
  } else {
    res.status(404).json({ message: "Carousel text not found" });
  }
});

// Routes for reason text
server.get("/reasonText/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const reasonText = router.db.get("reasonText").find({ id }).value();
  if (reasonText) {
    res.json(reasonText);
  } else {
    res.status(404).json({ message: "Reason text not found" });
  }
});

server.put("/reasonText/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedContent = req.body.content;
  const reasonText = router.db
    .get("reasonText")
    .find({ id })
    .assign({ content: updatedContent })
    .write();
  if (reasonText) {
    res.json(reasonText);
  } else {
    res.status(404).json({ message: "Reason text not found" });
  }
});

// Routes for genesis text
server.get("/genesisText/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const genesisText = router.db.get("genesisText").find({ id }).value();
  if (genesisText) {
    res.json(genesisText);
  } else {
    res.status(404).json({ message: "Genesis text not found" });
  }
});

server.put("/genesisText/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedContent = req.body.content;
  const genesisText = router.db
    .get("genesisText")
    .find({ id })
    .assign({ content: updatedContent })
    .write();
  if (genesisText) {
    res.json(genesisText);
  } else {
    res.status(404).json({ message: "Genesis text not found" });
  }
});

// Routes for page titles
server.get("/pageTitles/:id", (req, res) => {
  const id = req.params.id; // ID can be a string now
  console.log(`[DEBUG] GET /pageTitles/:id - id: ${id}`);
  router.db.read(); // Ensure the database state is fresh
  const dbState = router.db.getState(); // Get the current state of the database
  const allPageTitles = dbState.pageTitles; // Access pageTitles from the state
  console.log(`[DEBUG] All page titles (from getState):`, allPageTitles);
  const pageTitle = allPageTitles
    ? allPageTitles.find((item) => item.id === id)
    : undefined;
  console.log(`[DEBUG] Found page title (from getState):`, pageTitle);
  if (pageTitle) {
    res.json(pageTitle);
  } else {
    res.status(404).json({ message: "Page title not found" });
  }
});

server.put("/pageTitles/:id", (req, res) => {
  const id = req.params.id; // ID can be a string now
  const updatedContent = req.body.content;
  const dbState = router.db.getState(); // Get the current state of the database
  let allPageTitles = dbState.pageTitles; // Access pageTitles from the state

  if (!allPageTitles) {
    allPageTitles = [];
    dbState.pageTitles = allPageTitles;
  }

  const pageTitleIndex = allPageTitles.findIndex((item) => item.id === id);

  if (pageTitleIndex !== -1) {
    allPageTitles[pageTitleIndex].content = updatedContent;
    router.db.write(); // Persist changes
    res.json(allPageTitles[pageTitleIndex]);
  } else {
    const newTitle = { id: id, content: updatedContent };
    allPageTitles.push(newTitle);
    router.db.write(); // Persist changes
    res.status(201).json(newTitle);
  }
});

// Routes for page paragraphs
server.get("/pageParagraphs/:id", (req, res) => {
  const id = req.params.id;
  const dbState = router.db.getState();
  const allPageParagraphs = dbState.pageParagraphs;
  const pageParagraph = allPageParagraphs
    ? allPageParagraphs.find((item) => item.id === id)
    : undefined;
  if (pageParagraph) {
    res.json(pageParagraph);
  } else {
    res.status(404).json({ message: "Page paragraph not found" });
  }
});

server.put("/pageParagraphs/:id", (req, res) => {
  const id = req.params.id;
  const updatedContent = req.body.content;
  const dbState = router.db.getState();
  let allPageParagraphs = dbState.pageParagraphs;

  if (!allPageParagraphs) {
    allPageParagraphs = [];
    dbState.pageParagraphs = allPageParagraphs;
  }

  const pageParagraphIndex = allPageParagraphs.findIndex(
    (item) => item.id === id
  );

  if (pageParagraphIndex !== -1) {
    allPageParagraphs[pageParagraphIndex].content = updatedContent;
    router.db.write();
    res.json(allPageParagraphs[pageParagraphIndex]);
  } else {
    const newParagraph = { id: id, content: updatedContent };
    allPageParagraphs.push(newParagraph);
    router.db.write();
    res.status(201).json(newParagraph);
  }
});

// Routes for carousel images
server.get("/carouselImages", (req, res) => {
  const carouselImages = router.db.get("carouselImages").value();
  res.json(carouselImages);
});

server.put("/carouselImages/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedSlide = req.body;
  const carouselImage = router.db
    .get("carouselImages")
    .find({ id })
    .assign(updatedSlide)
    .write();
  if (carouselImage) {
    res.json(carouselImage);
  } else {
    res.status(404).json({ message: "Carousel image not found" });
  }
});

server.delete("/carouselImages/:id", (req, res) => {
  const id = parseInt(req.params.id);
  router.db.get("carouselImages").remove({ id }).write();
  res.status(200).json({ message: "Carousel image deleted" });
});

server.post("/carouselImages", (req, res) => {
  const newSlide = req.body;
  const carouselImages = router.db.get("carouselImages");
  const lastId =
    carouselImages.value().length > 0
      ? Math.max(...carouselImages.value().map((s) => s.id))
      : 0;
  newSlide.id = lastId + 1;
  carouselImages.push(newSlide).write();
  res.status(201).json(newSlide);
});

server.put("/carouselImages", (req, res) => {
  const updatedCarouselImages = req.body;
  router.db.set("carouselImages", updatedCarouselImages).write();
  res.status(200).json(updatedCarouselImages);
});

// PUT route for updating a team member by category and id
server.get("/teammembers", (req, res) => {
  const teammembers = router.db.get("teammembers").value();
  res.json(teammembers);
});

server.put("/teammembers/:category/:id", (req, res) => {
  const category = req.params.category;
  const id = parseInt(req.params.id);
  const updatedMember = req.body;

  console.log(`Server: PUT /teammembers/${category}/${id} - req.body:`, updatedMember);

  console.log(
    "PUT /teammembers - Category:",
    category,
    "ID:",
    id,
    "Updated Member:",
    updatedMember
  ); // Added log

  const teammembers = router.db.get("teammembers");
  const categoryMembers = teammembers.get(category);

  if (!categoryMembers.value()) {
    console.log("Category not found:", category); // Added log
    return res.status(404).json({ message: "Category not found" });
  }

  try {
    // Added try-catch block
    const memberToUpdate = categoryMembers.find({ id });

    if (memberToUpdate.value()) {
      // Check if member exists before updating
      const updated = memberToUpdate.assign(updatedMember).write();
      console.log("Successfully updated member:", updatedMember); // Log the updatedMember
      res.status(200).json(updatedMember);
    } else {
      console.log("Team member not found:", id);
      res.status(404).json({ message: "Team member not found" });
    }
  } catch (error) {
    console.error("Error during team member update:", error); // Added error log
    res.status(500).json({
      message: "Internal Server Error during update",
      error: error.message,
    });
  }
});

server.delete("/teammembers/:category/:id", (req, res) => {
  const category = req.params.category;
  const id = parseInt(req.params.id);

  const teammembers = router.db.get("teammembers");
  const categoryMembers = teammembers.get(category);

  if (!categoryMembers.value()) {
    return res.status(404).json({ message: "Category not found" });
  }

  const initialLength = categoryMembers.value().length;
  categoryMembers.remove({ id }).write();

  if (categoryMembers.value().length < initialLength) {
    res.status(200).json({ message: "Team member deleted" });
  } else {
    res.status(404).json({ message: "Team member not found" });
  }
});

server.post(
  "/teammembers/:category",
  teamUpload.single("image"),
  (req, res) => {
    const category = req.params.category;
    const db = router.db;
    const categoryMembers = db.get("teammembers").get(category);

    if (!categoryMembers.value()) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newMemberData = { ...req.body };

    if (req.file) {
      newMemberData.src = `images/photos/team/${category}/${req.file.filename}`;
    }

    const lastId =
      categoryMembers.value().length > 0
        ? Math.max(...categoryMembers.value().map((m) => m.id))
        : 0;
    newMemberData.id = lastId + 1;

    if (req.file) {
      newMemberData.cacheBust = Date.now();
    }

    categoryMembers.push(newMemberData).write();

    res.status(201).json(newMemberData);
  }
);

const carouselUploadsDir = path.join(
  __dirname,
  "..",
  "client",
  "public",
  "images",
  "photos",
  "carousel"
);
if (!fs.existsSync(carouselUploadsDir)) {
  fs.mkdirSync(carouselUploadsDir, { recursive: true });
}
const carouselStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carouselUploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const carouselUpload = multer({ storage: carouselStorage });

// Multer setup for places image uploads
const placesUploadsDir = path.join(
  __dirname,
  "..",
  "client",
  "public",
  "images",
  "photos",
  "places"
);
if (!fs.existsSync(placesUploadsDir)) {
  fs.mkdirSync(placesUploadsDir, { recursive: true });
}
const placesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, placesUploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const placesUpload = multer({ storage: placesStorage });

// Multer setup for project image uploads
const projectUploadsDir = path.join(
  __dirname,
  "..",
  "client",
  "public",
  "images",
  "photos",
  "projects"
);
if (!fs.existsSync(projectUploadsDir)) {
  fs.mkdirSync(projectUploadsDir, { recursive: true });
}
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category || "uncategorized";
    const dest = path.join(projectUploadsDir, category);
    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, dest);
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const projectUpload = multer({ storage: projectStorage });

// PUT route for updating a project with image upload
server.put("/projects/:id", projectUpload.single("image"), (req, res) => {
  const projectId = req.params.id;
  const db = router.db;
  const projects = db.get("projects");

  let project = projects.find({ id: projectId }).value();

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const updatedProjectData = { ...req.body };

  if (req.file) {
    const category = req.body.category || "uncategorized";
    updatedProjectData.src = `images/photos/projects/${category}/${req.file.filename}`;
  }

  const newProject = { ...project, ...updatedProjectData };

  if (req.file) {
    newProject.cacheBust = Date.now();
  }

  projects.find({ id: projectId }).assign(newProject).write();

  const responseProject = { ...newProject };

  res.json(responseProject);
});

// POST route for creating a new place with image upload
server.post("/places", placesUpload.single("image"), (req, res, next) => {
  if (req.file) {
    req.body.photo = `/images/photos/places/${req.file.filename}`;
  }
  // Convert contacts and links from stringified JSON back to arrays/objects
  if (req.body.contacts) {
    req.body.contacts = JSON.parse(req.body.contacts);
  }
  if (req.body.links) {
    req.body.links = JSON.parse(req.body.links);
  }
  // Let json-server handle the rest
  next();
});

// PUT route for updating a place with image upload
server.put("/places/:id", placesUpload.single("image"), (req, res) => {
  const placeId = parseInt(req.params.id, 10);
  const db = router.db; // lowdb instance
  const places = db.get("places");

  console.log(
    `[DEBUG] PUT /places/:id - placeId: ${placeId}, type: ${typeof placeId}`
  );
  console.log(`[DEBUG] req.file:`, req.file);
  console.log(`[DEBUG] req.body:`, req.body);

  let place = places.find({ id: placeId }).value();

  if (!place) {
    console.log(`[DEBUG] Place not found for id: ${placeId}`);
    return res.status(404).json({ message: "Place not found" });
  }

  console.log(`[DEBUG] Place before update:`, place);

  const updatedPlaceData = { ...req.body };

  // Ensure the ID in the body is also a number if it exists, or remove it
  if (updatedPlaceData.id) {
    delete updatedPlaceData.id;
  }

  if (req.file) {
    updatedPlaceData.src = `images/photos/places/${req.file.filename}`;
  }

  if (updatedPlaceData.contacts) {
    try {
      updatedPlaceData.contacts = JSON.parse(updatedPlaceData.contacts);
    } catch (e) {
      // Keep as string if parsing fails
    }
  }

  if (updatedPlaceData.links) {
    try {
      updatedPlaceData.links = JSON.parse(updatedPlaceData.links);
    } catch (e) {
      // Keep as string if parsing fails
    }
  }

  // Merge existing place data with updated data
  const newPlace = { ...place, ...updatedPlaceData };

  if (req.file) {
    newPlace.cacheBust = Date.now();
  }

  places.find({ id: placeId }).assign(newPlace).write();

  const responsePlace = { ...newPlace }; // Create a new object for the response

  console.log("[GEMINI-DEBUG] Place after update (responsePlace):", responsePlace);

  res.json(responsePlace);
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});