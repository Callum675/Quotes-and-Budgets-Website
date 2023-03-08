"use strict";
/*Required Modules*/
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

const app = express();

/*Cross-Origin Resource Sharing*/
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

/*Make JSON sent in the request body available as req.body*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/*Mongo Database*/
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

/*Routers*/
const userRoute = require("./routes/userRoute.js");
//const projectRoutes = require("./routers/projectRoutes.js");

/*Routes*/
app.use("/api/user", userRoute);
//app.use("/api/project", messageRoutes);

//404 handler and pass to error handler
app.use((req, res, next) => {
  /*
  const err = new Error('Not found');
  err.status = 404;
  next(err);
  */
  // You can use the above code if your not using the http-errors module
  next(createError(404, "Not found"));
});

//Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
