import passport from "passport";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { checkUniqueUser, insertUser } from "../db/queries.js";
import { validateUserSignUp } from "./validations.js";

// @desc Render index
// @route GET /

const renderIndex = (req, res, next) => {
  res.render("index", { title: "Homepage" });
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
      res.redirect("/");
    } catch (err) {
      console.error("Signup Error:", err.message); // Log the error
      return res.render("sign-up", {
        title: "Sign up error",
        errors: [{ msg: "Error occured during signup" }],
      });
    }
  },
];

// @desc Login user and redirect based on state
// @route POST /log-in
const validateLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // If authentication fails, render the login page with the error message
      return res.render("index", {
        title: "Login",
        messages: [info.message], // Capture the error message from Passport
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/"); // On successful login, redirect to the homepage
    });
  })(req, res, next);
};

// const validateLogin = (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/",
//     failureMessage: true,
//   })(req, res, next);
// };

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
  renderIndex,
  renderSignUp,
  validateSignUp,
  validateLogin,
  validateLogout,
};
