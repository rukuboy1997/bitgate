export function errorHandler(err, req, res, next) {
  console.error(err);

  res.status(400).json({
    success: false,
    error: err.message || "Something went wrong",
  });
}
