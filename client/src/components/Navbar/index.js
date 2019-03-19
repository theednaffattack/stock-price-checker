import React from "react";
import { Link as LinkBase } from "@reach/router";
import { Flex, Text } from "rebass";
import styled from "styled-components";
import { space } from "styled-system";

const Link = styled(LinkBase)`
  ${space}
  text-decoration: none;
  border-bottom: 2px transparent solid;

  &:hover {
    border-bottom: 2px crimson solid;
  }
`;

const Navbar = () => (
  <>
    <Flex flexDirection="row" mx="auto" width={[1 / 2]}>
      <Link mx={2} to="/">
        <Text color="white">Home</Text>
      </Link>
      <Link mx={2} to="stocks">
        <Text color="white">Stock Tracker</Text>
      </Link>
      <Link mx={2} to="library">
        <Text color="white">Personal Library</Text>
      </Link>
      <Link mx={2} to="converter">
        <Text color="white">Converter</Text>
      </Link>
    </Flex>
  </>
);

export default Navbar;
