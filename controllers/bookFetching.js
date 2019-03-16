const { Book } = require("../models/Book");
const { Comment } = require("../models/Comment");

module.exports = {
  countComments,
  deleteAllBooks,
  deleteAllComments,
  deleteBook,
  findBook,
  getAllBooks,
  saveBook,
  saveComment
};

function countComments({ book_id }) {
  return new Promise((resolve, reject) => {
    Comment.countDocuments({ book_id })
      .lean()
      .exec((err, number) => {
        if (err) reject(err);
        resolve(number);
      });
  }).catch(e => e);
}

function deleteAllBooks() {
  return new Promise((resolve, reject) => {
    Book.remove({}).exec((err, deleteResponse) => {
      if (err) reject(err);
      console.log("CHECK DELETE RESOPNSE");
      console.log(deleteResponse);
      resolve(deleteResponse);
    });
  });
}

function deleteAllComments() {
  return new Promise((resolve, reject) => {
    Comment.remove({}).exec((err, deleteResponse) => {
      if (err) reject(err);
      resolve(deleteResponse);
    });
  });
}

function deleteBook({ _id }) {
  return new Promise((resolve, reject) => {
    Book.findByIdAndRemove(_id).exec((err, doc) => {
      if (err) reject(err);
      if (!doc) resolve("no book exists");
      console.log("WAIT A SEC...");
      console.log(doc);
      resolve("delete successful");
    });
  });
}

function findBook({ id }) {
  return new Promise((resolve, reject) => {
    Book.find({ _id: id })
      .populate({ path: "comments", select: "-createAt -updatedAt" })
      .lean()
      .exec((err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
  });
}

function getAllBooks() {
  return new Promise((resolve, reject) => {
    Book.find({})
      .populate({ path: "comments", select: "-createAt -updatedAt" })
      .lean()
      .exec((err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
  });
}

function saveBook({ title }) {
  let book = new Book({ title });
  return new Promise((resolve, reject) => {
    book.save((err, doc) => {
      if (err) reject(err);
      resolve(doc);
    });
  });
}

async function saveComment({ book_id, comment }) {
  let createComment = new Comment({ book_id, text: comment });
  let newComment = await new Promise((resolve, reject) => {
    createComment.save((err, doc) => {
      if (err) reject(err);
      resolve(doc);
    });
  });
  console.log("VIEW newComment");
  console.log(newComment);
  console.log(newComment._id);
  console.log(book_id);
  console.log(comment);

  let pushCommentToBook = await new Promise((resolve, reject) => {
    const query = { _id: book_id };
    Book.findOneAndUpdate(query, {
      $push: { comments: newComment._id }
    }).exec((err, doc) => {
      if (err) reject("MOGNO ERRROR: " + err.message);
      resolve(doc);
    });
  });
  console.log("VIEW pushCommentToBook");
  console.log(pushCommentToBook);
  return pushCommentToBook;
}
