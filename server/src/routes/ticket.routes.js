const r = require("express").Router(),
  auth = require("../middleware/auth"),
  c = require("../controllers/ticket.controller");
r.route("/").get(auth, c.listTickets).post(auth, c.createTicket);
r.get("/:id", auth, c.getTicket);
r.post("/:id/replies", auth, c.replyTicket);
module.exports = r;
