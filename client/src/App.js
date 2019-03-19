import React, { Component } from "react";
import { Router as RouterBase } from "@reach/router";
import { Flex as FlexBase } from "rebass";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { minHeight, space, width } from "styled-system";

import Navbar from "./components/Navbar";
import StockTracker from "./components/StockTracker";
import PersonalLibrary from "./components/PersonalLibrary";
import Converter from "./components/Converter";
import NotFound from "./components/NotFound";

const Style = createGlobalStyle(`
  * { box-sizing: border-box; }
  body{ margin:0; }
`);

const theme = {
  fontSizes: [12, 14, 16, 24, 32, 48, 64, 96, 128],
  space: [
    // margin and padding
    0,
    4,
    8,
    16,
    32,
    64,
    128,
    256
  ],
  colors: {
    blue: "#07c",
    red: "#e10"
  }
};

const Router = styled(RouterBase)`
  ${space}
  ${width}
`;

const Flex = styled(FlexBase)`
  ${minHeight}
`;
class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Flex
          flexDirection="column"
          bg="pink"
          minHeight="100vh"
          alignItems="center"
          // justifyContent="center"
          width={[1]}
          className="App"
        >
          <Style />
          <Flex bg="indigo" p={3} flexDirection="row" width={[1]}>
            <Navbar />
          </Flex>
          <Router width={1}>
            <Home path="/" />
            <PersonalLibrary path="/library" />
            <StockTracker path="/stocks" />
            <Converter path="/converter" />

            <NotFound default />
          </Router>
        </Flex>
      </ThemeProvider>
    );
  }
}
export default App;

const Home = () => <div>Home</div>;
