// catch404 Middleware
const catch404 = (req, res, next) => {
  res.status(404).render("error", {
    title: "404 not found",
    message: "Page not found",
    status: 404,
  });
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Error for other errors

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error"; // Default message

  // For regular HTML routes, render an error page
  res.status(statusCode).render("error", {
    title: "Error",
    message: message,
    status: statusCode,
  });
};

export { catch404, errorHandler };
