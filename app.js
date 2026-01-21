const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

//middle wares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(8080, () => {
  console.log("App listening on port 8080");
});
