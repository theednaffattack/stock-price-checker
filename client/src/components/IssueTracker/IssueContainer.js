import axios from "axios";
import React, { Component } from "react";
import { Flex as FlexBase } from "rebass";
import { requestToApi } from "react-data-fetching";
import { borders, minHeight } from "styled-system";
import styled from "styled-components";

import { IssueForm } from "./IssueForm";
import { ResponseHandler } from "./ResponseHandler";
import IssuesList from "./IssuesList";

const Flex = styled(FlexBase)`
  ${borders}
  ${minHeight}
`;

export class IssueContainer extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.resetContainerRefetch = this.resetContainerRefetch.bind(this);
    this.handleIssueUpdate = this.handleIssueUpdate.bind(this);
    this.handleIssueDelete = this.handleIssueDelete.bind(this);
    this.state = {
      isLoadingMore: false,
      project: "fcc-challenge",
      issue_title: "",
      issue_text: "",
      created_by: "",
      assigned_to: "",
      status_text: "",
      issues: [],
      response: {}
    };
  }

  handleInputChange(event) {
    event.preventDefault();
    let { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  resetContainerRefetch() {
    this.setState({ isLoadingMore: false });
  }

  async handleIssueUpdate({ id, project }) {
    let query = { _id: id, project, open: false };
    console.log(query);

    let axiosPut = await axios.put(`/api/issues/${project}`, query);
    console.log("calling axios");
    console.log(axiosPut);

    // const apiResponse = await requestToApi({
    //   url: `/api/issues/${this.state.project}`,
    //   method: "PUT",
    //   body: query,
    //   headers: { ["Cache-Control"]: "no-cache" },
    //   onTimeout: () => console.log("⏱️ Timeout!"),
    //   onProgress: progression => ("♻️ Progressing...", progression),
    //   // params: { page: 5, start: 0, limit: 20 },
    //   timeout: 2500
    // });
    this.setState(() => ({ response: axiosPut.data, isLoadingMore: true }));
  }

  async handleIssueDelete({ id, project }) {
    console.log("VIEW THE _ID TO DELETE");
    console.log(id);
    console.log(project);
    let query = { _id: id };
    // let axiosDelete = await axios.delete(`/api/issues/${project}`, query);
    let axiosDelete = await axios({
      method: "delete",
      data: query,
      url: `/api/issues/${project}`
    });

    // const apiResponse = await requestToApi({
    //   url: `/api/issues/${this.state.project}`,
    //   method: "DELETE",
    //   body: query,
    //   headers: { ["Cache-Control"]: "no-cache" },
    //   onTimeout: () => console.log("⏱️ Timeout!"),
    //   onProgress: progression => ("♻️ Progressing...", progression),
    //   // params: { page: 5, start: 0, limit: 20 },
    //   timeout: 2500
    // });
    this.setState(() => ({ response: axiosDelete.data, isLoadingMore: true }));
  }

  async handleFormSubmit() {
    let {
      issue_title,
      issue_text,
      created_by,
      assigned_to,
      status_text
    } = this.state;
    let formData = {
      issue_title,
      issue_text,
      created_by,
      assigned_to,
      status_text
    };
    const apiResponse = await requestToApi({
      url: `/api/issues/${this.state.project}`,
      method: "POST",
      body: formData,
      headers: { ["Cache-Control"]: "no-cache" },
      onTimeout: () => console.log("⏱️ Timeout!"),
      onProgress: progression => ("♻️ Progressing...", progression),
      // params: { page: 5, start: 0, limit: 20 },
      timeout: 2500
    });
    this.setState(() => ({ response: apiResponse.data, isLoadingMore: true }));
  }
  render() {
    let notIssues = this.state;
    delete notIssues.issues;
    return (
      <Flex flexDirection="column">
        <IssueForm
          submit={this.handleFormSubmit}
          formState={notIssues}
          inputState={this.handleInputChange}
        />
        {/* <ResponseHandler response={this.state.response} /> */}
        <IssuesList
          update={this.handleIssueUpdate}
          deleteMe={this.handleIssueDelete}
          refresh={this.resetContainerRefetch}
          refetch={this.state.isLoadingMore}
          project={this.state.project}
        />
      </Flex>
    );
  }
}
