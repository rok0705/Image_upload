//////////////////////// BACKEND SERVER ///////////////////////////
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { imageRouter } = require("./routes/imageRouter");

const app = express();
const { MONGO_URI, SERVER_LISTEN_PORT } = process.env;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoDB connected!");
    app.listen(SERVER_LISTEN_PORT, () =>
      console.log("Express server listening on PORT: " + SERVER_LISTEN_PORT)
    );
    app.use("/images", imageRouter);
    app.use("/uploads", express.static("uploads"));
  })
  .catch((err) => console.log("mongoDB connection error!"));
