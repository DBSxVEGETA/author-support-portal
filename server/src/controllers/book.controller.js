const Book = require("../models/Book");
exports.listBooks = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { authorId: req.user.authorId };
    const books = await Book.find(filter).sort({ title: 1 });
    res.json({ success: true, count: books.length, books });
  } catch (e) {
    next(e);
  }
};
exports.getBook = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== "admin") filter.authorId = req.user.authorId;
    const book = await Book.findOne(filter);
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Book not found." });
    res.json({ success: true, book });
  } catch (e) {
    next(e);
  }
};
