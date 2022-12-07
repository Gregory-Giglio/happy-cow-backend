const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

const usersRoutes = require("./routes/user.js");
app.use(usersRoutes);

app.all("*", (req, res) => {
  res.status(400).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started ! ");
});
