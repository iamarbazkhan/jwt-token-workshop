const express = require("express");
// const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/post");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
dotenv.config();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

// Db connection

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected "))
  .catch((error) => console.log(`error is ${error}`));

// app.use(morgan("dev"));

app.post("/create-user", (req, res) => {
  const userData = new User(req.body);
  userData.save((err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    return res.status(200).json({
      data,
    });
  });
});
app.post("/login", (req, res) => {
  const jwtToken = jwt.sign(req.body, process.env.SECRET_ACCESS_TOKEN);
  res.status(200).json({
    token: jwtToken,
  });
});

app.get("/verify-user", verifyJwtToken, async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ exist: false });
  }
  const userData = await User.find({ userName: req.user.userName });
  if (userData) {
    res.json({ data: userData });
  }
});

function verifyJwtToken(req, res, next) {
  const headerData = req.headers["authorization"];
  const jwtString = headerData && headerData.split(" ")[1];
  if (jwtString === null) return res.senStatus(401);
  jwt.verify(jwtString, process.env.SECRET_ACCESS_TOKEN, (err, res) => {
    if (err) {
      req.user = false;
      next();
    }
    req.user = res;
    next();
  });
}

app.listen(PORT);
