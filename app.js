/////// app.js

import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import path from "path";
import expressEjsLayouts from "express-ejs-layouts";
import passport from "./config/passport.js"; // Import Passport configuration
import { authRouter } from "./routes/authRoutes.js";

const app = express();

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

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(authRouter);

app.get("/", (req, res) => {
  res.render("index", { title: "Homepage" });
});

app.listen(3000, () => console.log("app listening on port 3000!"));
