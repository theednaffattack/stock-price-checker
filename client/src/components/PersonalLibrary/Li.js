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
    this.props.click(this.props.value);
  }
  render() {
    let { children, value } = this.props;
    return (
      <StyledLi value={value} onClick={this.handleClick}>
        {children}
      </StyledLi>
    );
  }
}

export default LiItem;
