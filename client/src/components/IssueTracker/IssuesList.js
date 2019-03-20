import React, { Component } from "react";
import { Fetch } from "react-data-fetching";

import { Button, Card, Flex as FlexBase, Heading, Text } from "rebass";
import { borders, height, minHeight } from "styled-system";
import styled from "styled-components";

// import { Loader } from "./components";

const Flex = styled(FlexBase)`
  ${borders}
  ${minHeight}
  ${height}
`;

export default class IssuesList extends Component {
  constructor(props) {
    super(props);
    this.resetRetch = this.resetRetch.bind(this);
    this.updateIssue = this.updateIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
  }
  resetRetch() {
    this.props.refresh();
  }
  updateIssue(event) {
    let obj = {
      id: event.target.id,
      project: event.target.project
    };
    this.props.update(obj);
  }
  deleteIssue(event) {
    let obj = {
      id: event.target.id,
      project: this.props.project
    };
    this.props.deleteMe(obj);
  }
  render() {
    // update={this.handleIssueUpdate}
    //       delete={this.handleIssueDelete}
    let { project, refetch } = this.props;
    return (
      <Fetch
        loader={() => (
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="auto"
          >
            Loading...
          </Flex>
        )} // Replace this with your lovely handcrafted loader
        url={`api/issues/${project}`}
        timeout={5000}
        refetchKey={refetch}
        onFetch={this.resetRetch}
      >
        {({ data }) => (
          <Flex flexDirection="column" mx="auto" width={1}>
            <h1>Username</h1>
            {data
              ? data.map(item => (
                  <Card key={Math.random()} my="2" bg="white">
                    <Heading>{item.item_title}</Heading>
                    <Text>open: {item.open.toString()}</Text>
                    <Text>id: {item._id}</Text>
                    <Text>title: {item.issue_title}</Text>
                    <Text>text: {item.issue_text}</Text>
                    <Text>created by: {item.created_by}</Text>
                    <Text>assigned to: {item.assigned_to}</Text>
                    <Text>project: {item.project}</Text>
                    <Button
                      project={item.project}
                      id={item._id}
                      onClick={this.updateIssue}
                    >
                      Close
                    </Button>
                    <Button
                      project={item.project}
                      id={item._id}
                      onClick={this.deleteIssue}
                    >
                      Delete
                    </Button>
                  </Card>
                ))
              : ""}
          </Flex>
        )}
      </Fetch>
    );
  }
}
