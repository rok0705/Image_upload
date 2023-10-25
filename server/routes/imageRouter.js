const { Router } = require("express");
const imageRouter = Router();
const Image = require("./../models/Image");
const { upload } = require("../middleware/imageUpload");
const fs = require("fs");
const { promisify } = require("util");
const fileUnlink = promisify(fs.unlink);
const mongoose = require("mongoose");

imageRouter.post("/", upload.single("image"), async (req, res) => {
  // 유저 정보, public 유무 확인
  try {
    if (!req.user) throw new Error("Not enough Privilege.");
    const image = await new Image({
      user: {
        _id: req.user.id,
        name: req.user.name,
        username: req.user.username,
      },
      public: req.body.public,
      key: req.file.filename,
      originalFileName: req.file.originalname,
    }).save();
    res.json(image);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/", async (req, res) => {
  // public 이미지들만 제공
  const images = await Image.find({ public: true });
  console.log("images returned by mongoDB:", images);
  res.json(images);
});

imageRouter.delete("/:imageId", async (req, res) => {
  // 유저 권한 확인
  // 사진 삭제
  // 1. uploads 폴더에 있는 사진 삭제
  // 2. mongoDB 에 있는 document 삭제
  try {
    console.log(req.params);
    if (!req.user) throw new Error("Not enough privilege.");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("Invalid ImageId.");

    const image = await Image.findOneAndDelete({ _id: req.params.imageId });
    if (!image) return res.json({ message: "The image does not exist." });
    await fileUnlink(`./uploads/${image.key}`);
    res.json({ message: `${image.key} deleted successfully.` });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/like", (req, res) => {
  // 유저 권한 확인
  // like 중복 안되도록 확인
});

imageRouter.patch("/:imageId/unlike", (req, res) => {
  // 유저 권한 확인
  // like 중복 안되도록 확인
});

module.exports = { imageRouter };
