/////// app.js

import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { fileURLToPath } from "url";
import path from "path";
import expressEjsLayouts from "express-ejs-layouts";
import passport from "./config/passport.js"; // Import Passport configuration
import { authRouter } from "./routes/authRoutes.js";
import { messageRouter } from "./routes/messageRoutes.js";
import pool from "./config/database.js";
import { catch404, errorHandler } from "./middleware/errorHandler.js";

const app = express();
// Initialize pgSession by passing express-session
const pGSession = connectPgSimple(session);

// Get directory & file names using ES module compatible methods
const __filename = fileURLToPath(import.meta.url); // Correct way to get __filename
const __dirname = path.dirname(__filename); // Correct way to get __dirname

// EJS VIEW TEMPLATE SETUP
// Setup static folder
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Setting Up EJS as the View Engine
app.use(expressEjsLayouts);
app.set("layout");
app.set("view engine", "ejs");
// Setting the Views Directory
app.set("views", path.join(__dirname, "views"));

// END EJS VIEW TEMPLATE SETUP

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new pGSession({
      pool: pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true, // Prevent client-side JS from accessing the cookie
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.messages = req.session.messages || [];
  delete req.session.messages; // Clear messages after they've been rendered
  next();
});

app.use(authRouter);
app.use(messageRouter);

// ERROR HANDLER
// Catch 404 and forward to the error handler
app.use(catch404);
app.use(errorHandler);

app.listen(3000, () => console.log("app listening on port 3000!"));
