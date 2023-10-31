const { Router } = require("express");
const imageRouter = Router();
const Image = require("./../models/Image");
const { upload } = require("../middleware/imageUpload");
const fs = require("fs");
// const { promisify } = require("util");
// const fileUnlink = promisify(fs.unlink);
const mongoose = require("mongoose");
const { s3, getSignedUrl } = require("../aws");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

imageRouter.post("/presigned", async (req, res) => {
  try {
    if (!req.user) throw new Error("invalid privilege.");
    const { contentTypes } = req.body;
    if (!Array.isArray(contentTypes)) throw new Error("invalid content types.");
    const presignedData = await Promise.all(
      contentTypes.map(async (contentType) => {
        const imageKey = `${uuid()}.${mime.extension(contentType)}`;
        const key = `raw/${imageKey}`;
        const presigned = await getSignedUrl({ key });
        return { imageKey, presigned };
      })
    );
    res.json(presignedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

imageRouter.post("/", upload.array("image", 5), async (req, res) => {
  // 유저 정보, public 유무 확인
  try {
    if (!req.user) throw new Error("Not enough Privilege.");
    const { images, public } = req.body;

    const imageDocs = await Promise.all(
      images.map((image) =>
        new Image({
          user: {
            _id: req.user.id,
            name: req.user.name,
            username: req.user.username,
          },
          public,
          key: image.imageKey,
          originalFileName: image.originalname,
        }).save()
      )
    );

    res.json(imageDocs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// imageRouter.post("/", upload.array("image", 5), async (req, res) => {
//   // 유저 정보, public 유무 확인
//   try {
//     if (!req.user) throw new Error("Not enough Privilege.");
//     const images = await Promise.all(
//       req.files.map(async (file) => {
//         const image = await new Image({
//           user: {
//             _id: req.user.id,
//             name: req.user.name,
//             username: req.user.username,
//           },
//           public: req.body.public,
//           key: file.key.replace("raw/", ""),
//           originalFileName: file.originalname,
//         }).save();
//         return image;
//       })
//     );
//     res.json(images);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

imageRouter.get("/", async (req, res) => {
  try {
    const { lastid } = req.query;
    if (lastid && !mongoose.isValidObjectId(lastid))
      throw new Error("invalid lastid.");
    const images = await Image.find(
      lastid
        ? {
            public: true,
            _id: { $lt: lastid },
          }
        : {
            public: true,
          }
    )
      .sort({ _id: -1 })
      .limit(10);
    res.json(images);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

imageRouter.delete("/:imageId", async (req, res) => {
  // 유저 권한 확인
  // 사진 삭제
  // 1. uploads 폴더에 있는 사진 삭제
  // 2. mongoDB 에 있는 document 삭제
  try {
    const { imageId } = req.params;
    if (!req.user) throw new Error("Not enough privilege.");
    if (!mongoose.isValidObjectId(imageId)) throw new Error("Invalid ImageId.");

    const image = await Image.findOneAndDelete({ _id: req.params.imageId });
    if (!image) return res.json({ message: "The image does not exist." });
    // await fileUnlink(`./uploads/${image.key}`);
    s3.deleteObject(
      {
        Bucket: "image-upload-storage",
        Key: `raw/${image.key}`,
      },
      (error, data) => {
        if (error) throw error;
      }
    );

    res.json({ message: `${image.key} deleted successfully.` });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/:imageId", async (req, res) => {
  try {
    const { imageId } = req.params;
    if (!mongoose.isValidObjectId(imageId)) throw new Error("Invalid imageId.");

    const image = await Image.findOne({ _id: imageId });
    if (!image) throw new Error("Image does not exist.");
    if (!image.public && (!req.user || req.user.id !== image.user.id))
      throw new Error("no privilege.");
    res.json(image);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/like", async (req, res) => {
  // 유저 권한 확인
  // like 중복 안되도록 확인
  try {
    if (!req.user) throw new Error("Not enough privilege.");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    if (!mongoose.isValidObjectId(image)) throw new Error("Invalid imageId.");

    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
  // 유저 권한 확인
  // like 중복 안되도록 확인
  try {
    if (!req.user) throw new Error("Not enough privilege.");
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    if (!mongoose.isValidObjectId(image)) throw new Error("Invalid imageId.");

    res.json(image);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { imageRouter };
