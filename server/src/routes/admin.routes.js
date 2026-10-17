const router = require("express").Router(),
  auth = require("../middleware/auth"),
  allow = require("../middleware/authorize"),
  ticketController = require("../controllers/ticket.controller");

router.get("/tickets", auth, allow("admin"), ticketController.listTickets);
router.patch(
  "/tickets/:id",
  auth,
  allow("admin"),
  ticketController.adminUpdateTicket,
);
router.post(
  "/tickets/:id/draft-response",
  auth,
  allow("admin"),
  ticketController.generateDraft,
);
router.post(
  "/tickets/:id/send-response",
  auth,
  allow("admin"),
  ticketController.sendDraft,
);

module.exports = router;
