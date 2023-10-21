const express = require("express");
const app = express();
const { v4 } = require("uuid");
const mime = require("mime-types");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype))
      cb(null, true);
    else cb("invalid file type", false);
  },
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

app.get("/api", (req, res) => {
  console.log("backend : received GET /api HTTP request!");
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/item/:slug", (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

app.use("/uploads,", express.static("uploads"));

app.post("/upload", upload.single("image"), (req, res) => {
  console.log("req.file:", req.file);
  res.json(req.file);
});

module.exports = app;
