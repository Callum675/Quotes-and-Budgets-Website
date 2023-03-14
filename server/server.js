"use strict";
/*Required Modules*/
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
require("dotenv").config();

const app = express();

/*Make JSON sent in the request body available as req.body*/
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/*Cross-Origin Resource Sharing*/
app.use(cors());

/*Mongo Database*/
const mongoUrl = process.env.DB_URL;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

/*Routes*/
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
  );
}

/* Read https Files. 
// Generate a self-signed certificate using OpenSSL by running the following command:
// openssl req -nodes -new -x509 -keyout server.key -out server.cert
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};*/

const PORT = process.env.PORT || 5000;

//Server Using Express App*/
//const server = https.createServer(options, app);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
