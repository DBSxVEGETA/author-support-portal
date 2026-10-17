exports.notFound = (req, res) =>
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });

exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.isJoi)
    return res.status(400).json({
      success: false,
      message: err.details?.[0]?.message || "Invalid input.",
    });
  if (err.name === "ValidationError")
    return res.status(400).json({ success: false, message: err.message });
  if (err.code === 11000)
    return res.status(409).json({
      success: false,
      message: "A record with that unique value already exists.",
    });
  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : "An unexpected server error occurred.",
  });
};
