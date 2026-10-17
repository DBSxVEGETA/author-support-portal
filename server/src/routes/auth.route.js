const router = require("express").Router(),
  auth = require("../middleware/auth"),
  authController = require("../controllers/auth.controller");

router.post("/login", authController.login);
router.get("/me", auth, authController.me);

module.exports = router;
