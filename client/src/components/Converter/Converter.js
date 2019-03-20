import React, { Component } from "react";
import { Box, Button, Flex as FlexBase } from "rebass";
import { borders, minHeight } from "styled-system";
import styled from "styled-components";

import ConvertFetch from "./FetchComponent_v2";

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
        minHeight="100vh"
      >
        <ConvertFetch />
      </Flex>
    );
  }
}
