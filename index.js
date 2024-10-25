// const express = require("express"); // commonJS
import express from "express"; //module
import connectDB from "./configuration/database.js";
import taskRoutes from "./routes/task-routes.js";
import userRoutes from "./routes/user-routes.js";

import cors from "cors";
import config from "./configuration/env.config.js";
import cookieParser from "cookie-parser";

connectDB();

const app = express();
const port = config.port;

//The use of parsing middleware has to be called BEFORE the routes are called
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://white-hill-01b898f10.5.azurestaticapps.net",
      "https://ashy-island-0a6f85110.5.azurestaticapps.net",
    ],
  })
);

app.use(cookieParser());
// refactor to different file, single app.use for all routes
app.get("/", (req, res) => res.json({ message: "Kanban board api" }));

app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(
    `welcome to the kanban board NodeJS backend listening on port ${port}`
  );
});
