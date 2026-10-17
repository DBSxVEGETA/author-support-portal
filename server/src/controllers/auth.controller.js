const Joi = require("joi"),
  bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  User = require("../models/User");

exports.login = async (req, res, next) => {
  try {
    const { error, value } = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(1).required(),
    }).validate(req.body);

    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const user = await User.findOne({
      email: value.email.toLowerCase(),
    }).select("+password");

    if (!user || !(await bcrypt.compare(value.password, user.password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authorId: user.authorId,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.me = (req, res) =>
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      authorId: req.user.authorId,
    },
  });
