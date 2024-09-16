import passport from "passport";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import {
  checkUniqueUser,
  insertUser,
  enableSecretStatus,
  disableSecretStatus,
} from "../db/queries.js";
import { validateUserSignUp, validateSecret } from "./validations.js";

// @desc Render login page
// @route GET /login

const renderLogin = (req, res, next) => {
  res.render("login", { title: "Login", errors: null });
};

// @desc Render dashboard
// @route GET /dashboard

const renderDashboard = (req, res, next) => {
  res.render("dashboard", { title: "Dashboard", errors: null });
};

// @desc Render sign up-form
// @route GET /sign-up-form
const renderSignUp = (req, res, next) => {
  res.render("sign-up", { title: "Sign up form", errors: null });
};

// @desc Validate signup, hash pass and redirect to home
// @route POST
const validateSignUp = [
  validateUserSignUp,
  async (req, res, next) => {
    const errors = validationResult(req);
    let allErrors = errors.array();

    try {
      const userExist = await checkUniqueUser(req.body.username);

      if (userExist) {
        allErrors.push({ msg: "Username already exists" }); // Add the error for existing username
      }

      // If there are any errors (validation or username exists), render the form with errors
      if (allErrors.length > 0) {
        return res.status(400).render("sign-up", {
          title: "Sign Up error",
          errors: allErrors,
        });
      }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      // Insert the new user into the database
      await insertUser(req.body.username, hashedPassword);

      // Redirect after successful signup
      res.redirect("/dashboard");
    } catch (err) {
      console.error("Signup Error:", err.message); // Log the error
      return res.render("sign-up", {
        title: "Sign up error",
        errors: [{ msg: "Error occured during signup" }],
      });
    }
  },
];

const enableSecretMemberStatus = [
  validateSecret,
  async (req, res, next) => {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        return res.status(400).render("dashboard", {
          title: "Error",
          errors: errors.array(),
        });
      }
      console.log("Succes secret password for club");
      // Update the user's membership status here if needed
      await enableSecretStatus(req.user.id);
      return res.redirect("/dashboard");
    } catch (error) {
      console.error("Error processing secret password:", error.message);
      return res.render("dashboard", {
        title: "Secret Q error",
        errors: [{ msg: "Error occured during secret validation" }],
      });
    }
  },
];

const disableSecretMemberStatus = async (req, res, next) => {
  try {
    // console.log(req.user.id);
    await disableSecretStatus(req.user.id);
    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Error disabling secret status", error);
    return res.render("dashboard", {
      title: "Secret Q error",
      errors: [{ msg: "Error occured during secret disabling" }],
    });
  }
};

// @desc Login user and redirect based on state
// @route POST /log-in
const validateLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // If authentication fails, render the login page with the error message
      return res.render("login", {
        title: "Login",
        messages: [info.message], // Capture the error message from Passport
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/dashboard"); // On successful login, redirect to the dashbaord
    });
  })(req, res, next);
};

// @desc Logout user and redirect to index
// @route GET /
const validateLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

export {
  renderLogin,
  renderSignUp,
  renderDashboard,
  validateSignUp,
  validateLogin,
  validateLogout,
  enableSecretMemberStatus,
  disableSecretMemberStatus,
};
