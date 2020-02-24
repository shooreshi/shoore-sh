const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const blogsRoutes = require('./routes/blogs');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect(
  "mongodb+srv://shooresh:" + process.env.MONGO_ATLAS_PW + "@cluster0-9ua9m.mongodb.net/shoore-sh-dev?retryWrites=true")
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("shoore-sh-api/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/blogs", blogsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
