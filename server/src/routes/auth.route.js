const r = require("express").Router(),
  auth = require("../middleware/auth"),
  c = require("../controllers/auth.controller");
r.post("/login", c.login);
r.get("/me", auth, c.me);
module.exports = r;
