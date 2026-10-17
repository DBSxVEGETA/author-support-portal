const r = require("express").Router(),
  auth = require("../middleware/auth"),
  allow = require("../middleware/authorize"),
  c = require("../controllers/ticket.controller");
r.get("/tickets", auth, allow("admin"), c.listTickets);
r.patch("/tickets/:id", auth, allow("admin"), c.adminUpdateTicket);
r.post("/tickets/:id/draft-response", auth, allow("admin"), c.generateDraft);
r.post("/tickets/:id/send-response", auth, allow("admin"), c.sendDraft);
module.exports = r;
