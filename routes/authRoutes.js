import express from "express";
import {
  renderSignUp,
  renderLogin,
  renderDashboard,
  validateSignUp,
  validateLogin,
  validateLogout,
  enableSecretMemberStatus,
  disableSecretMemberStatus,
} from "../controllers/authController.js";
import { deleteMessage } from "../controllers/messageController.js";
import { ensureAdmin } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

authRouter.delete("/messages/:id", ensureAdmin, deleteMessage);

authRouter.get("/login", renderLogin);

authRouter.get("/dashboard", renderDashboard);

authRouter.get("/sign-up", renderSignUp);

authRouter.post("/sign-up", validateSignUp);

authRouter.post("/log-in", validateLogin);

authRouter.post("/secretmember", enableSecretMemberStatus);

authRouter.get("/exitsecretclub", disableSecretMemberStatus);

authRouter.get("/log-out", validateLogout);

export { authRouter };
