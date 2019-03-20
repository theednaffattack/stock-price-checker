import React, { Fragment } from "react";
import { Box, Flex as FlexBase } from "rebass";
import { borders, height, minHeight, space, width } from "styled-system";
import styled from "styled-components";

const Pre = styled.pre`
${width}
${space}
${borders}
`;
const Flex = styled(FlexBase)`
  ${height}
`;

export const ResponseHandler = props => (
  <Fragment>
    {Object.keys(props.response).length === 0 &&
    props.response.constructor === Object ? (
      ""
    ) : (
      <Flex mx="auto" width={1 / 2} height="auto">
        <Pre>{JSON.stringify(props.response, null, 2)}</Pre>
      </Flex>
    )}
  </Fragment>
);
