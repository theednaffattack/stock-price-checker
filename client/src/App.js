import React, { Component } from "react";
import { Router, Link as LinkBase } from "@reach/router";
import { Flex as FlexBase, Heading, Text } from "rebass";
import styled from "styled-components";
import { minHeight, space } from "styled-system";

import StockTracker from "./components/StockTracker";
import PersonalLibrary from "./components/PersonalLibrary";

const Flex = styled(FlexBase)`
  ${minHeight}
`;

const Link = styled(LinkBase)`
  ${space}
  text-decoration: none;
  border-bottom: 2px transparent solid;

  &:hover {
    border-bottom: 2px crimson solid;
  }
`;
class App extends Component {
  render() {
    return (
      <Flex
        flexDirection="column"
        bg="pink"
        minHeight="100vh"
        alignItems="center"
        // justifyContent="center"
        width={[1]}
        className="App"
      >
        <Flex bg="indigo" p={3} flexDirection="row" width={[1]}>
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
          </Flex>
        </Flex>
        <Router>
          <Home path="/" />
          <PersonalLibrary path="/library" />
          <StockTracker path="/stocks" />
        </Router>
      </Flex>
    );
  }
}
export default App;

const Home = () => <div>Home</div>;
