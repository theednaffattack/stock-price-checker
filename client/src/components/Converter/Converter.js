import React, { Component } from "react";
import { Box, Button, Flex as FlexBase } from "rebass";
import { borders, minHeight } from "styled-system";
import styled from "styled-components";

import Container from "./FetchComponent_v1";
import Other from "./FetchComponent_v2";

const Flex = styled(FlexBase)`
  ${borders}
  ${minHeight}
`;

export class Converter extends Component {
  render() {
    return (
      <Flex
        flexDirection="column"
        justifyContent="center"
        width={[1]}
        border="1px red solid"
        minHeight="100vh"
      >
        <Box mx="auto">
          <label htmlFor="convert">
            Convert Metric to Imperial units and vice versa
          </label>
        </Box>
        <Box mx="auto">
          <input type="text" name="convert" id="convert" />
          <Button>submit</Button>
        </Box>
        <Container />
        <Other />
      </Flex>
    );
  }
}
