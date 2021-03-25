const Book = require("../models/Book");
const createError = require("http-errors");

exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (e) {
    next(e);
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) throw new createError.NotFound();
    res.status(200).send(book);
  } catch (e) {
    next(e);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) throw new createError.NotFound();
    res.status(200).send(book);
  } catch (e) {
    next(e);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!book) throw new createError.NotFound();
    res.status(200).send(book);
  } catch (e) {
    next(e);
  }
};

exports.addBook = async (req, res, next) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(200).send(book);
  } catch (e) {
    next(e);
  }
};
