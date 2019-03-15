import React, { Component } from "react";
import styled from "styled-components";

const StyledLi = styled.li`
  font-size: 20px;
`;

class LiItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    let { title, id, comments } = this.props;
    let revealObj = {
      title,
      id,
      comments
    };
    this.props.click(revealObj);
  }
  render() {
    let { children } = this.props;
    return <StyledLi onClick={this.handleClick}>{children}</StyledLi>;
  }
}

export default LiItem;
