import express from "express";
import {
  renderIndex,
  renderSignUp,
  validateSignUp,
  validateLogin,
  validateLogout,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

authRouter.get("/", renderIndex);

authRouter.get("/sign-up", renderSignUp);

authRouter.post("/sign-up", validateSignUp);

authRouter.post("/log-in", validateLogin);

authRouter.get("/log-out", validateLogout);

export { authRouter };
