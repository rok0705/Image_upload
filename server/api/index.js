const express = require("express");
const app = express();
const { v4 } = require("uuid");

app.get("/api", (req, res) => {
  console.log("server received /api request successfully!");
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

module.exports = app;
