import React, { Component } from "react";
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
    title: "hello"
  },
  booksCollection: [
    {
      title: "title 1",
      comments: 4,
      _id: "1kjgsd98u7dfg"
    },
    {
      title: "title 2",
      comments: 9,
      _id: "9ksrjfd98u7000"
    },
    {
      title: "title 3",
      comments: 0,
      _id: "1k666668u7dfg"
    }
  ],
  reveal: {
    title: "blasdkfjf",
    id: "",
    comments: [
      {
        _id: "99999333",
        text: "this is a comment"
      },
      {
        _id: "77777333",
        text: "this is another comment"
      },
      {
        _id: "11111111",
        text: "woo hoooooo, enough to map"
      }
    ]
  }
};

class PersonalLibrary extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      bookForm: { title: initialState.bookForm.title },
      booksCollection: [...initialState.booksCollection],
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
  handleClick(obj) {
    let { id, title, comments } = obj;
    this.setState({
      reveal: { id, title, comments }
    });
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
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
          <Flex mx="auto" flexDirection="column" width={1 / 2}>
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
            <Button bg="indigo">Submit New Book!</Button>
          </Flex>
        </Box>
        <Box>
          <Ul>
            {this.state.booksCollection.map(book => (
              <LiItem
                click={this.handleClick}
                id={book._id}
                title={book.title}
                comments={book.comments}
                key={Math.random()}
              >
                {book.title} - {book.comments} comments
              </LiItem>
            ))}
          </Ul>
        </Box>
        <Box>
          {this.state.reveal.title} (id: {this.state.reveal.id})
        </Box>
        <Box>
          {this.state.reveal.comments.length > 1
            ? this.state.reveal.comments.map((comment, index) => (
                <Text key={Math.random()}>
                  {index + 1} - {comment.text}
                </Text>
              ))
            : ""}
        </Box>
      </Flex>
    );
  }
}

export default PersonalLibrary;
