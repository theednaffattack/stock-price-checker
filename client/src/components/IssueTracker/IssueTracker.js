import React, { Component } from "react";
import { Box, Button, Flex as FlexBase } from "rebass";
import { borders, minHeight } from "styled-system";
import styled from "styled-components";

import { IssueContainer } from "./IssueContainer";

const Flex = styled(FlexBase)`
  ${borders}
  ${minHeight}
`;

export class IssueTracker extends Component {
  render() {
    return (
      <Flex
        flexDirection="column"
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <IssueContainer />
      </Flex>
    );
  }
}
