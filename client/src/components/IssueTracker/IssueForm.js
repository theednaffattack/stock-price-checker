import React, { Fragment } from "react";
import { Button, Flex as FlexBase, Heading } from "rebass";
import { borders, minHeight } from "styled-system";
import styled from "styled-components";

const Flex = styled(FlexBase)`
  ${borders}
  ${minHeight}
`;

export const IssueForm = ({ formState, submit, inputState }) => (
  <Fragment>
    <Heading>Submit a New Issue</Heading>
    <input
      value={formState.project}
      onChange={inputState}
      placeholder="*Project"
      type="hidden"
      name="project"
      id="project"
    />
    <input
      value={formState.issue_title}
      onChange={inputState}
      placeholder="*Title"
      type="text"
      name="issue_title"
      id="issue_title"
    />
    <textarea
      value={formState.issue_text}
      onChange={inputState}
      placeholder="*Text"
      name="issue_text"
      id="issue_text"
    />
    <Flex>
      <input
        value={formState.created_by}
        onChange={inputState}
        placeholder="*Created by"
        type="text"
        name="created_by"
        id="created_by"
      />
      <input
        value={formState.assigned_to}
        onChange={inputState}
        placeholder="(opt) Assigned to"
        type="text"
        name="assigned_to"
        id="assigned_to"
      />
      <input
        value={formState.status_text}
        onChange={inputState}
        placeholder="(opt) Status text"
        type="text"
        name="status_text"
        id="status_text"
      />
    </Flex>
    <Button onClick={submit}>Submit Issue</Button>
  </Fragment>
);
