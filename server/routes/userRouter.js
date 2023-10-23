const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const { hash, compare } = require("bcryptjs");
const mongoose = require("mongoose");

userRouter.post("/register", async (req, res) => {
  try {
    if (req.body.password.length < 6)
      throw new Error("password minimum length is 6.");
    if (req.body.username.length < 3)
      throw new Error("username minium length is 3.");
    const hashedPassword = await hash(req.body.password, 10);
    const user = await new User({
      name: req.body.name,
      username: req.body.username,
      hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save();
    res.json({
      message: `${req.body.name} is registered successfully.`,
      sessionId: user.sessions[0]._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.patch("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const isValid = await compare(req.body.password, user.hashedPassword);
    if (!isValid) throw new Error("invalid user information.");
    user.sessions.push({ createdAt: new Date() });
    const session = user.sessions[user.sessions.length - 1];
    await user.save();
    res.json({
      message: `${req.body.name} validated.`,
      sessionId: session._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };

userRouter.patch("/logout", async (req, res) => {
  try {
    console.log(req.headers);
    const { sessionid } = req.headers;
    if (!mongoose.isValidObjectId(sessionid))
      throw new Error("invalid sessionId");
    const user = await User.findOne({ "sessions._id": sessionid });
    console.log(user);
    if (!user) throw new Error("the sessionId does not exist in database.");
    await User.updateOne(
      { _id: user.id },
      { $pull: { sessions: { _id: sessionid } } }
    );
    res.json({ message: "logout successful." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
