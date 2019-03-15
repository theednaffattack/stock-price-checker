import React, { Component } from "react";
import axios from "axios";
// import cors from "cors";
import logo from "../logo.svg";
import "../App.css";
class StockTracker extends Component {
  state = {
    response: "",
    responseToo: [],
    post: {
      stock: "",
      like: false
    },
    post2: { stock1: "", like1: false, stock2: "", like2: false },
    hello: "",
    responseToPost: ""
  };
  // componentDidMount() {
  //   this.callApi()
  //     .then(res => this.setState({ response: res.stockData }))
  //     .catch(err => console.log(err));
  // }
  callApi = async e => {
    e.preventDefault();

    // build query parameters
    var esc = encodeURIComponent;
    var query = Object.keys(this.state.post)
      .map(k => esc(k) + "=" + esc(this.state.post[k]))
      .join("&");

    console.log(query);
    const fullUrl = "/api/stock-prices?" + query;

    const response = await fetch(fullUrl);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("data return from `callApi`");
    console.log(body);
    this.setState({ response: body });
    return body;
  };
  callApiToo = async e => {
    console.log("WHERE ARE MY LOGS?");
    e.preventDefault();

    // build query parameters
    var esc = encodeURIComponent;
    var buildQuery = Object.keys(this.state.post2)
      .map(k => esc(k) + "=" + esc(this.state.post2[k]))
      .join("&");

    const query = buildQuery.replace(/\d/g, "");

    console.log("query");
    console.log(buildQuery.replace(/\d/g, ""));

    const response = await axios.get(`/api/stock-prices?${query}`);

    // const body = await response.json();
    if (response.status !== 200) throw Error(response.message);
    console.log("ALL THAT SWEET DATA");
    console.log(response.data.stockData);
    this.setState({ responseToo: response.data });
    return response;
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch("/api/world", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ post: this.state.post })
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
        <form name="stock_form" id="stock_form" onSubmit={this.callApi}>
          <input
            value={this.state.post.stock}
            type="text"
            name="stock"
            id="stock"
            onChange={e =>
              this.setState({ post: { stock: e.target.value, likes: false } })
            }
          />
          <input
            value={this.state.post.like}
            type="checkbox"
            name="like"
            id="like"
            checked={this.state.post.like}
            onChange={e =>
              this.setState(prevState => ({
                post: {
                  stock: prevState.post.stock,
                  like: !prevState.post.like
                }
              }))
            }
          />
          <p>{this.state.response.stockSymbol}</p>
          <p>{this.state.response.lastRefreshed}</p>
          <p>{this.state.response.timeZone}</p>
          <p>{this.state.response.dailyHigh}</p>
          <button type="submit">SUBMIT</button>
        </form>

        <form
          name="two_stocks_form"
          id="two_stocks_form"
          onSubmit={this.callApiToo}
        >
          <input
            name="stock1"
            value={this.state.post2.stock1}
            onChange={e => {
              e.preventDefault();
              let { value } = e.target;
              this.setState((prevState, props) => ({
                post2: {
                  stock1: value,
                  like1: prevState.post2.like1,
                  stock2: prevState.post2.stock2,
                  like2: prevState.post2.like2
                }
              }));
            }}
            id="stock1"
            type="text"
          />

          <input
            name="stock2"
            value={this.state.post2.stock2}
            onChange={e => {
              e.preventDefault();
              let { value } = e.target;
              this.setState((prevState, props) => ({
                post2: {
                  stock1: prevState.post2.stock1,
                  like1: prevState.post2.like1,
                  stock2: value,
                  like2: prevState.post2.like2
                }
              }));
            }}
            id="stock1"
            type="text"
          />

          <input
            value={this.state.post2.like2}
            type="checkbox"
            name="like_both"
            id="like_both"
            checked={this.state.post2.like2}
            onChange={e =>
              this.setState(prevState => ({
                post2: {
                  stock1: prevState.post2.stock1,
                  like1: !prevState.post2.like1,
                  stock2: prevState.post2.stock2,
                  like2: !prevState.post2.like2
                }
              }))
            }
          />
          <button type="submit">SUBMIT</button>
        </form>

        <form name="hello_form" id="hello_form" onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            name="hello"
            id="hello"
            value={this.state.hello}
            onChange={e => this.setState({ hello: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
      </div>
    );
  }
}
export default StockTracker;
