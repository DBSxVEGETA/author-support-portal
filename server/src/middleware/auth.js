const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = async function auth(req, res, next) {
  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Authentication token required." });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Account no longer exists." });
    req.user = user;
    next();
  } catch (e) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Invalid or expired authentication token.",
      });
  }
};
