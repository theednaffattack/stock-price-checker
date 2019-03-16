import axios from "axios";
import React, { Component, Fragment } from "react";
import { Box, Button, Flex as FlexBase, Text } from "rebass";
import styled from "styled-components";
import {
  color,
  fontSize,
  lineHeight,
  minHeight,
  space,
  width,
  height
} from "styled-system";

import LiItem from "./Li";

const Flex = styled(FlexBase)`
  ${minHeight}
`;

const Input = styled.input`
    ${color}
    ${fontSize}
    ${height}
    ${lineHeight}
    ${space}
    ${width}
`;

const Ul = styled.ul`
  list-style-type: none;
`;

const initialState = {
  bookForm: {
    title: ""
  },
  booksCollection: [
    {
      title: "",
      commentcount: 0,
      comments: [
        {
          _id: "",
          text: ""
        }
      ],
      _id: ""
    }
  ],
  commentToSubmit: "",
  reveal: {
    title: "",
    id: "",
    commentcount: 0,
    comments: []
  }
};

class PersonalLibrary extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDeleteBook = this.handleDeleteBook.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGetBooks = this.handleGetBooks.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.state = {
      bookForm: { title: initialState.bookForm.title },
      booksCollection: [...initialState.booksCollection],
      commentToSubmit: initialState.commentToSubmit,
      reveal: initialState.reveal
    };
  }
  handleChange(e) {
    e.preventDefault();
    let { value } = e.target;
    this.setState(prevState => {
      return {
        bookForm: { title: value }
      };
    });
  }

  handleCommentChange(e) {
    e.preventDefault();
    let { value } = e.target;
    this.setState(prevState => {
      return {
        commentToSubmit: value
      };
    });
  }

  handleClick(obj) {
    let { id, title, commentcount, comments } = obj;
    this.setState({
      reveal: { id, title, commentcount, comments }
    });
  }

  async handleDeleteBook(id) {
    let deletion = await axios.delete(`/api/books/${id}`);
    console.log(deletion);
    let findDeletedIndex = this.state.booksCollection
      .map(book => book._id)
      .indexOf(id);
    console.log(findDeletedIndex);
    this.setState(prevState => ({
      booksCollection: prevState.booksCollection.filter(
        (book, subIndex) => subIndex !== findDeletedIndex
      )
    }));
    // this.handleGetBooks();
  }

  async handleGetBooks() {
    let allBooks = await axios.get("/api/books");
    if (allBooks.status !== 200) throw Error(allBooks.message);
    return allBooks;
  }

  async handleSubmitComment(event) {
    event.preventDefault();
    let { bookId, value } = event.target;
    // COME BACK TO THIS AFTER THE BOOKS (SINGLE) GET ROUTE IS FINISHED
    const { data } = await axios.post(`/api/books/${this.state.reveal.id}`, {
      book_id: this.state.reveal.id,
      comment: this.state.commentToSubmit
    });

    let indexPos = this.state.booksCollection
      .map(book => book._id)
      .indexOf(this.state.reveal.id);
    this.setState((prevState, prevProps) => ({
      booksCollection: prevState.booksCollection.map((book, index) => {
        if (index === indexPos) {
          return data;
        }
        return book;
      }),
      reveal: data
    }));
  }

  async handleSubmit(event) {
    event.preventDefault();

    const response = await axios.post(`/api/books`, this.state.bookForm);
    this.setState((prevState, prevProps) => ({
      booksCollection: prevState.booksCollection.concat([response.data]),
      bookForm: { title: "" }
    }));
  }

  componentDidMount() {
    this.handleGetBooks()
      .then(res => this.setState({ booksCollection: res.data }))
      .catch(err => console.log(err));
  }

  render() {
    let {
      bookForm: { title }
    } = this.state;
    return (
      <Flex
        justifyContent="center"
        flexDirection="column"
        height="auto"
        minHeight="100vh"
        mx="auto"
        width={[1 / 2]}
        bg="white"
      >
        <Box>
          <Text pb={3} fontSize={[4, 4, 4]}>
            Personal Library
          </Text>
          {/* <pre>{JSON.stringify(this.state, null, 2)}</pre> */}
          <Flex mx="auto" flexDirection="column" width={1 / 2}>
            <form id="books" name="books" onSubmit={this.handleSubmit}>
              <label htmlFor="book-title">Book Title</label>
              <Input
                p={2}
                fontSize={2}
                placeholder="Input book title"
                value={title}
                onChange={this.handleChange}
                type="text"
                id="book-title"
                name="book-title"
              />
              <Button bg="indigo" type="submit">
                Submit New Book!
              </Button>
            </form>
          </Flex>
        </Box>
        <Box>
          <Ul>
            {this.state.booksCollection.map(book => (
              <LiItem
                deleteClick={this.handleDeleteBook}
                click={this.handleClick}
                id={book._id}
                title={book.title}
                comments={book.comments}
                commentcount={book.commentcount}
                key={Math.random()}
              />
            ))}
          </Ul>
        </Box>
        <Box>
          <Text fontSize={4}>{this.state.reveal.title}</Text>
        </Box>
        {this.state.reveal.title !== "" ? (
          <form
            id="comment-form"
            name="comment-form"
            onSubmit={this.handleSubmitComment}
          >
            <Box>
              <Input
                p={2}
                fontSize={2}
                placeholder="Leave a comment"
                value={this.state.commentToSubmit}
                bookId={this.state.reveal.id}
                onChange={this.handleCommentChange}
                type="text"
                id="comment"
                name="comment"
              />
              <Button>Submit Comment</Button>
            </Box>
          </form>
        ) : null}
        <Box>
          {this.state.reveal.comments
            ? this.state.reveal.comments.length > 0
              ? this.state.reveal.comments.map((comment, index) => (
                  <Flex width={1 / 2} mx="auto" key={comment._id}>
                    <Box>
                      <Text>
                        {index + 1} - {comment.text}
                      </Text>
                    </Box>
                    <Button
                      id={comment._id}
                      commentId={comment._id}
                      bg="crimson"
                    >
                      X
                    </Button>
                  </Flex>
                ))
              : ""
            : ""}
        </Box>
        <Box>
          <Button bg="crimson">Delete All</Button>
        </Box>
      </Flex>
    );
  }
}

export default PersonalLibrary;
