const Joi = require("joi"),
  Ticket = require("../models/Ticket"),
  Book = require("../models/Book");
const { classifyTicket, draftResponse } = require("../services/ai.service");

function safe(t, user) {
  const o = t.toObject ? t.toObject() : t;

  if (user.role !== "admin") {
    o.replies = (o.replies || []).filter((r) => !r.internal);
    delete o.aiDraft;
    delete o.assignedTo;
  }
  return o;
}

exports.createTicket = async (req, res, next) => {
  try {
    const { error, value } = Joi.object({
      bookId: Joi.string().allow("", null),
      subject: Joi.string().trim().min(3).max(160).required(),
      description: Joi.string().trim().min(5).max(10000).required(),
      attachmentName: Joi.string().max(255).allow(""),
    }).validate(req.body);

    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    let book = null;

    if (value.bookId) {
      book = await Book.findOne({
        bookId: value.bookId,
        authorId: req.user.authorId,
      });
      if (!book)
        return res.status(400).json({
          success: false,
          message:
            "Select one of your own books, or choose General / Account Level.",
        });
    }

    const bookTitle = book ? book.title : "General / Account Level";
    const cls = await classifyTicket({
      subject: value.subject,
      description: value.description,
      bookTitle,
    });
    const ticket = await Ticket.create({
      author: req.user._id,
      authorId: req.user.authorId,
      book: book ? book._id : null,
      bookTitle,
      subject: value.subject,
      description: value.description,
      attachmentName: value.attachmentName || "",
      category: cls.category,
      priority: cls.priority,
    });
    const io = req.app.get("io");

    if (io)
      io.to(`user:${req.user._id}`).emit("ticket:created", {
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
      });

    res.status(201).json({
      success: true,
      ticket: safe(ticket, req.user),
      classificationSource: cls.source,
    });
  } catch (e) {
    next(e);
  }
};

exports.listTickets = async (req, res, next) => {
  try {
    const f = req.user.role === "admin" ? {} : { author: req.user._id };

    for (const k of ["status", "category", "priority"])
      if (req.query[k]) f[k] = req.query[k];

    const tickets = await Ticket.find(f)
      .populate("author", "name email authorId")
      .sort({ lastActivityAt: -1 })
      .limit(200);

    res.json({
      success: true,
      count: tickets.length,
      tickets: tickets.map((t) => safe(t, req.user)),
    });
  } catch (e) {
    next(e);
  }
};

exports.getTicket = async (req, res, next) => {
  try {
    const f = { _id: req.params.id };

    if (req.user.role !== "admin") f.author = req.user._id;

    const t = await Ticket.findOne(f)
      .populate("author", "name email authorId")
      .populate("assignedTo", "name email");

    if (!t)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found." });

    res.json({ success: true, ticket: safe(t, req.user) });
  } catch (e) {
    next(e);
  }
};

exports.replyTicket = async (req, res, next) => {
  try {
    const { error, value } = Joi.object({
      message: Joi.string().trim().min(1).max(10000).required(),
    }).validate(req.body);

    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const f = { _id: req.params.id };

    if (req.user.role !== "admin") f.author = req.user._id;

    const t = await Ticket.findOne(f);

    if (!t)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found." });

    t.replies.push({
      authorId: req.user._id,
      authorName: req.user.name,
      role: req.user.role,
      message: value.message,
      internal: false,
    });

    t.lastActivityAt = new Date();
    if (["Resolved", "Closed"].includes(t.status)) t.status = "Open";
    await t.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`user:${t.author}`).emit("ticket:updated", { ticketId: t._id });
      io.to("admins").emit("ticket:updated", { ticketId: t._id });
    }
    res.status(201).json({ success: true, ticket: safe(t, req.user) });
  } catch (e) {
    next(e);
  }
};

exports.adminUpdateTicket = async (req, res, next) => {
  try {
    const schema = Joi.object({
      status: Joi.string().valid(...Ticket.statuses),
      category: Joi.string().valid(...Ticket.categories),
      priority: Joi.string().valid(...Ticket.priorities),
      assignToMe: Joi.boolean(),
      internalNote: Joi.string().trim().min(1).max(5000),
      aiDraft: Joi.string().allow("").max(10000),
    }).min(1);

    const { error, value } = schema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const t = await Ticket.findById(req.params.id);
    if (!t)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found." });

    for (const k of ["status", "category", "priority", "aiDraft"])
      if (value[k] !== undefined) t[k] = value[k];

    if (value.assignToMe) t.assignedTo = req.user._id;
    if (value.internalNote)
      t.replies.push({
        authorId: req.user._id,
        authorName: req.user.name,
        role: "admin",
        message: value.internalNote,
        internal: true,
      });
    t.lastActivityAt = new Date();
    await t.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`user:${t.author}`).emit("ticket:updated", { ticketId: t._id });
      io.to("admins").emit("ticket:updated", { ticketId: t._id });
    }
    res.json({ success: true, ticket: safe(t, req.user) });
  } catch (e) {
    next(e);
  }
};

exports.generateDraft = async (req, res, next) => {
  try {
    const t = await Ticket.findById(req.params.id).populate(
      "author",
      "name email",
    );
    if (!t)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found." });
    const r = await draftResponse(t);
    t.aiDraft = r.draft;
    await t.save();
    res.json({
      success: true,
      draft: r.draft,
      source: r.source,
      ticketId: t._id,
    });
  } catch (e) {
    next(e);
  }
};

exports.sendDraft = async (req, res, next) => {
  try {
    const { error, value } = Joi.object({
      message: Joi.string().trim().min(1).max(10000).required(),
    }).validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const t = await Ticket.findById(req.params.id);
    if (!t)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found." });
    t.replies.push({
      authorId: req.user._id,
      authorName: req.user.name,
      role: "admin",
      message: value.message,
      internal: false,
    });
    t.status = "In Progress";
    t.lastActivityAt = new Date();
    await t.save();
    const io = req.app.get("io");
    if (io)
      io.to(`user:${t.author}`).emit("ticket:updated", { ticketId: t._id });
    res.status(201).json({ success: true, ticket: safe(t, req.user) });
  } catch (e) {
    next(e);
  }
};
