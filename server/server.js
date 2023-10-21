//////////////////////// BACKEND SERVER ///////////////////////////

const express = require("express");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
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

const app = express();
const PORT = 5000;

app.listen(PORT, () =>
  console.log("Express server listening on PORT: " + PORT)
);

app.post("/upload", upload.single("imageTest"), (req, res) => {
  console.log("req.file:", req.file);
  res.json(req.file);
});

app.use("/uploads", express.static("uploads"));
