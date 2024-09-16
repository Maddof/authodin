// Amin check middleware
const ensureAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  }
  return res.status(403).json({ error: "Unauthorized" });
};

export { ensureAdmin };
