const router = require("express").Router(),
  auth = require("../middleware/auth"),
  ticketController = require("../controllers/ticket.controller");

router
  .route("/")
  .get(auth, ticketController.listTickets)
  .post(auth, ticketController.createTicket);
router.get("/:id", auth, ticketController.getTicket);
router.post("/:id/replies", auth, ticketController.replyTicket);

module.exports = router;
