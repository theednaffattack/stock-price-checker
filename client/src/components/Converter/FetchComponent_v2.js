import React, { Component, Fragment } from "react";
import { requestToApi } from "react-data-fetching";
import { Button, Text } from "rebass";

const initialState = { input: "", response: {} };

export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this._onSignUp = this._onSignUp.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  _onSignUp = async () => {
    console.log("calling api/convert");
    const apiResponse = await requestToApi({
      url: `/api/convert?input=${this.state.input}`,
      method: "GET",
      onTimeout: () => console.log("⏱️ Timeout!"),
      onProgress: progression => ("♻️ Progressing...", progression),
      // params: { page: 5, start: 0, limit: 20 },
      timeout: 2500
    });
    console.log(Object.keys(apiResponse));
    console.log(apiResponse.data);
    this.setState(() => ({ response: apiResponse.data }));
  };

  handleInputChange(event) {
    event.preventDefault();

    let { value } = event.target;

    this.setState(prevState => ({
      input: value
    }));
  }

  render() {
    const { response } = this.state;
    return (
      <Fragment>
        <h1>
          {"Conversion? "}
          {/* {JSON.stringify(this.state)} */}
          <label htmlFor="convert">
            Convert Metric to Imperial units and vice versa
          </label>
          <input
            type="text"
            value={this.state.input}
            onChange={this.handleInputChange}
            name="convert"
            id="convert"
          />
          {response.string ? <Text>{response.string}</Text> : ""}
        </h1>
        <Button onClick={this._onSignUp}>Submit</Button>
      </Fragment>
    );
  }
}
