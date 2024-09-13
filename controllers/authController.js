import passport from "passport";

// @desc Render sign up-form
// @route GET /sign-up-form
const renderSignUp = (req, res, next) => {
  res.render("sign-up-form", { title: "Sign up form" });
};

// @desc Validate signup, hash pass and redirect to home
// @route POST
const validateSignUp = async (req, res, next) => {
  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Insert the new user into the database
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      req.body.username,
      hashedPassword,
    ]);
    // Redirect after successful signup
    res.redirect("/", { title: "Homepage" });
  } catch (err) {
    return next(err);
  }
};

// @desc Login user and redirect based on state
// @route POST /log-in
const validateLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
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

export { renderSignUp, validateSignUp, validateLogin, validateLogout };
