import React, { Component } from "react";
import { Box, Text } from "rebass";
import { Fetch } from "react-data-fetching";

export default class Container extends Component {
  render() {
    const searchString = "20km";
    return (
      <Fetch url={`/api/convert?input=${searchString}`} method="GET">
        {({ data }) => (
          <Box>
            {/* <Text>{data.name}</Text> */}

            <Text>{data ? data.string : ""}</Text>
          </Box>
        )}
      </Fetch>
    );
  }
}
