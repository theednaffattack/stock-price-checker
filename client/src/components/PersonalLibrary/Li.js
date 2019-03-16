import React, { Component } from "react";
import { Flex, Box, Button, Text } from "rebass";
import styled from "styled-components";

const StyledLi = styled.li`
  font-size: 20px;
`;

class LiItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  handleClick() {
    let { title, id, commentcount, comments } = this.props;
    let revealObj = {
      title,
      id,
      commentcount,
      comments
    };
    this.props.click(revealObj);
  }

  handleDeleteClick() {
    let { id } = this.props;
    console.log("view from within LiItem");
    console.log(id);
    this.props.deleteClick(id);
  }
  render() {
    let { title, commentcount, id } = this.props;
    return (
      <StyledLi>
        <Flex mx="auto" width={[1 / 2]}>
          <Box onClick={this.handleClick}>
            <Text>
              {title} - {commentcount} comments
            </Text>
          </Box>
          <Button onClick={this.handleDeleteClick} ml={3} bg="crimson">
            X
          </Button>
        </Flex>
      </StyledLi>
    );
  }
}

export default LiItem;
