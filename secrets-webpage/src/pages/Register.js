import React, { Component } from "react";
import { Link } from "react-router-dom";
import Idm from "../services/Idm";

import "../css/identityform.css";
export class Register extends Component {
  state = {
    email: "",
    password: "",
    message: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const { history } = this.props;

    Idm.register(email, password).then((response) => {
      let resultCode = response["data"]["resultCode"];
      if (resultCode === 21) {
        history.push("/login");
      } else if (resultCode === 12) {
        this.setState({ message: "this email is already registered." });
      } else {
        this.setState({ message: "invalid email format." });
      }
    });
  };

  updateField = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  render() {
    const { email, password, message } = this.state;
    return (
      <>
        <div className="box">
          <h1>Register</h1>
          <h2>Make an account today!</h2>
          <form onSubmit={this.handleSubmit}>
            <input
              placeholder="Email"
              className="input"
              type="email"
              name="email"
              value={email}
              onChange={this.updateField}
            />
            <input
              placeholder="Password"
              className="input"
              type="password"
              name="password"
              value={password}
              onChange={this.updateField}
            />
            <button className="button">Sign Up</button>
          </form>
          {message !== "" && <p style={{ color: "red" }}>{message}</p>}
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </>
    );
  }
}

export default Register;
