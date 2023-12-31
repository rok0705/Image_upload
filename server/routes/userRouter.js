const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const Image = require("./../models/Image");
const { hash, compare } = require("bcryptjs");
const mongoose = require("mongoose");

userRouter.post("/register", async (req, res) => {
  try {
    console.log("req.body:\n", req.body);
    if (req.body.password.length < 6)
      throw new Error("password minimum length is 6.");
    if (req.body.userName.length < 3)
      throw new Error("username minium length is 3.");
    const hashedPassword = await hash(req.body.password, 10);
    const user = await new User({
      name: req.body.name,
      username: req.body.userName,
      hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save();
    res.json({
      message: `${req.body.name} is registered successfully.`,
      sessionId: user.sessions[0]._id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/login", async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const user = await User.findOne({ username: req.body.userName });
    if (!user) throw new Error("invalid username.");
    const isValid = await compare(req.body.password, user.hashedPassword);
    if (!isValid) throw new Error("invalid user information.");
    user.sessions.push({ createdAt: new Date() });
    const session = user.sessions[user.sessions.length - 1];
    await user.save();
    res.json({
      message: `${req.body.userName} validated.`,
      userId: user.username,
      sessionId: session._id,
      name: user.name,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/logout", async (req, res) => {
  try {
    if (!req.user) throw new Error("invalid sessionId on logout request.");
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );
    res.json({ message: "logout successful." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/me", (req, res) => {
  try {
    if (!req.user) throw new Error("invalid privilege.");
    res.json({
      message: "success",
      sessionId: req.headers.sessionid,
      name: req.user.name,
      userId: req.user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/me/images", async (req, res) => {
  // 본인의 사진들만 리턴 ( public == false)
  try {
    if (!req.user) throw new Error("Not enough Privilege.");
    const { lastid } = req.query;
    if (lastid && !mongoose.isValidObjectId(lastid))
      throw new Error("invalid lastid.");
    const images = await Image.find(
      lastid
        ? {
            "user._id": req.user.id,
            _id: { $lt: lastid },
          }
        : {
            "user._id": req.user.id,
          }
    )
      .sort({ _id: -1 })
      .limit(10);
    res.json(images);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };
