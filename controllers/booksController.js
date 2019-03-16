const { log } = console;

const {
  countComments,
  deleteAllBooks,
  deleteAllComments,
  deleteBook,
  findBook,
  getAllBooks,
  saveBook,
  saveComment
} = require("./bookFetching");

module.exports = {
  booksGetController,
  booksDeleteAllController,
  booksDeleteOneController,
  booksPostController
};

async function booksGetController(req, res) {
  let { id } = req.params;
  if (id === undefined || id === null) {
    console.log("can't sense req.params.id (/api/books/:id)");

    console.log(req.params);

    let allTheBooks = await getAllBooks();

    let booksWithCountsAppended = await Promise.all(
      allTheBooks.map(async book => {
        let commentcount = await countComments({ book_id: book._id });
        book.commentcount = commentcount;
        return book;
      })
    );

    res.status(200).send(booksWithCountsAppended);
  }
  if (id) {
    console.log("CAN see req.params");
    let [bookToReturn] = await findBook({ id });
    let commentcount = await countComments({ book_id: id });
    bookToReturn.commentcount = commentcount;
    let { title, _id, comments } = bookToReturn;
    res.status(200).send({ title, _id, comments });
  }
}

async function booksDeleteAllController(req, res) {
  let isDeletedAllBooks = await deleteAllBooks();
  let isDeletedAllComments = await deleteAllComments();

  let deleteMessage = "";
  if (isDeletedAllBooks.ok === 1 && isDeletedAllComments.ok === 1) {
    deleteMessage = "complete delete successful";
    return res.status(200).send(deleteMessage);
  }
  deleteMessage = `Something went wrong: Books status ${
    isDeletedAllBooks.ok
  }, Comments status ${isDeletedAllComments.ok}`;
  res.send(deleteMessage);
}

async function booksDeleteOneController(req, res) {
  let { id: _id } = req.params;
  let deletion = await deleteBook({ _id });
  // find the book in the db
  // if the book is not found return `no book exists` to client
  // if the book does exist delete it and send the text message
  // `delete successful`
  res.status(200).send(deletion);
}

async function booksPostController(req, res) {
  let { id } = req.params;
  if (id === undefined || id === null) {
    let { title: titleForBook } = req.body;

    let response = await saveBook({ title: titleForBook }).then(data => data);

    let { _id, title, comments = [] } = response;

    let commentcount = await countComments({ book_id: _id });

    res.status(200).send({
      _id,
      title,
      commentcount,
      comments
    });
  }
  if (id) {
    let { book_id, comment } = req.body;
    let response = await saveComment({ book_id, comment }).then(data => data);
    let theBook = await findBook({ id: book_id });
    let { _id, title, comments } = theBook[0];
    res.status(200).send({
      _id,
      title,
      commentcount: comments.length || 0,
      comments
    });
  }
}
