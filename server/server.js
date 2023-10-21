const express = require("express");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
const upload = multer({ storage });

const app = express();
const PORT = 5000;

app.post("/upload", upload.single("imageTest"), (req, res) => {
  console.log("req.file:", req.file);
  res.json(req.file);
});

app.listen(PORT, () =>
  console.log("Express server listening on PORT: " + PORT)
);
