const express = require("express");
const multer = require("multer");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.static('public'));


app.set("trust proxy", 1);

/* =========================
   SESSION (LOCAL + RENDER)
========================= */
app.use(
  session({
    secret: "admin-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  })
);


/* =========================
   BODY PARSER
   (for login / enable only)
========================= */
app.use(express.json());

/* =========================
   ADMIN MIDDLEWARE
========================= */
function isAdmin(req, res, next) {
  if (req.session.admin) return next();
  return res.status(403).json({
    success: false,
    message: "Unauthorized"
  });
}

/* =========================
   MULTER STORAGE
   ✅ USES QUERY PARAMS ONLY
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const section = req.query.section;

    if (!section) {
      return cb(new Error("No section provided"));
    }

    const uploadDir = path.join(
      __dirname,
      "public",
      "uploads",
      section
    );

    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const filename = req.query.filename;

    if (!filename) {
      return cb(new Error("No filename provided"));
    }

    cb(null, filename);
  }
});

const upload = multer({ storage });

/* =========================
   AUTH ROUTES
========================= */
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    req.session.admin = true;
    return res.json({ success: true });
  }

  res.status(401).json({ success: false });
});

app.get("/admin/check", (req, res) => {
  res.json({ admin: !!req.session.admin });
});

app.post("/admin/enable", (req, res) => {
  const { key } = req.body;

  if (key === "shazaam") {
    req.session.admin = true;
    return res.json({ success: true });
  }

  res.status(403).json({ success: false });
});

/* =========================
   IMAGE UPLOAD (PER IMAGE SLOT)
========================= */
app.post(
  "/admin/upload",
  isAdmin,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    res.json({
      success: true,
      filename: req.file.filename,
      section: req.query.section
    });
  }
);



/* =========================
   STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   HEALTH CHECK
========================= */
app.get("/ping", (req, res) =>
  res.send("Server is alive ✅")
);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
