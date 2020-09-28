import React, { Component } from "react";
import Axios from "axios";

import NavBar from "./components/navbar";
import Content from "./Content";

const localStorage = require("local-storage");

class App extends Component {
  state = {
    loggedIn: this.checkedLoggedIn(),
    securityLevel: this.checkedSecurityLevel(),
  };

  handleLogIn = (email, securityLevel) => {
    const { common } = Axios.defaults.headers;

    localStorage.set("email", email);
    localStorage.set("security", securityLevel);
    common["email"] = email;

    this.setState({ loggedIn: true, securityLevel: securityLevel });
  };

  handleLogOut = () => {
    const { common } = Axios.defaults.headers;
    localStorage.remove("email");
    localStorage.set("security", 5);

    delete common["email"];
    this.setState({ loggedIn: false, securityLevel: 5 });
  };

  checkedLoggedIn() {
    return localStorage.get("email") !== null;
  }
  checkedSecurityLevel() {
    return localStorage.get("security");
  }

  render() {
    const { loggedIn, securityLevel } = this.state;
    return (
      <>
        <NavBar
          handleLogOut={this.handleLogOut}
          loggedIn={loggedIn}
          securityLevel={securityLevel}
        />
        <Content
          handleLogIn={this.handleLogIn}
          handleLogOut={this.handleLogOut}
          loggedIn={loggedIn}
        />
      </>
    );
  }
}

export default App;
