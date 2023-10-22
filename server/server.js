//////////////////////// BACKEND SERVER ///////////////////////////

const express = require("express");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const mongoose = require("mongoose");
require("dotenv").config();
const Image = require("./models/Image");

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

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoDB connected!");
    app.listen(PORT, () =>
      console.log("Express server listening on PORT: " + PORT)
    );
    app.post("/images", upload.single("image"), async (req, res) => {
      const image = await new Image({
        key: req.file.filename,
        originalFileName: req.file.originalname,
      }).save();
      res.json(image);
    });
    app.get("/images", async (req, res) => {
      const images = await Image.find();
      console.log("images returned by mongoDB:", images);
      res.json(images);
    });
    app.use("/uploads", express.static("uploads"));
  })
  .catch((err) => console.log("mongoDB connection error!"));
