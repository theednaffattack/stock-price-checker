import React from "react";
import { Flex, Button, Text } from "rebass";

export const BookInfo = ({ title, commentcount }) => (
  <Flex mx="auto" width={[1 / 2]}>
    <Text>
      {title} - {commentcount} comments
    </Text>
    <Button ml={3} bg="crimson">
      X
    </Button>
  </Flex>
);
