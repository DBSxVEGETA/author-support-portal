const r = require("express").Router(),
  auth = require("../middleware/auth"),
  c = require("../controllers/book.controller");
r.get("/", auth, c.listBooks);
r.get("/:id", auth, c.getBook);
module.exports = r;
