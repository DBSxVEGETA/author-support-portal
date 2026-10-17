const router = require("express").Router(),
  auth = require("../middleware/auth"),
  bookController = require("../controllers/book.controller");

router.get("/", auth, bookController.listBooks);
router.get("/:id", auth, bookController.getBook);

module.exports = router;
