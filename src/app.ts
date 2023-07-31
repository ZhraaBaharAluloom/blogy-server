import { attachControllers } from "@decorators/express";
import express from "express";
import passport from "passport";
import cors from "cors";
import path from "path";

import BlogController from "./controllers/blogsController";
import postgresDataSource from "./database";
import { jwtStrategy, localStrategy } from "./middleware/passport";
import UserController from "./controllers/userController";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/media", express.static(path.join(__dirname, "media")));

const PORT = 3000;

attachControllers(app, [BlogController, UserController]);

app.listen(PORT, () => {
  console.log(`This server is running on ${PORT}`);
});

postgresDataSource
  .initialize()
  .then(() => {
    console.log("The db is connected");
  })
  .catch((error) => {
    console.log(error);
  });
