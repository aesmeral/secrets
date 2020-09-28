import React, { Component } from "react";
import { Link } from "react-router-dom";
import Idm from "../services/Idm";
import "../css/identityform.css";

export class Login extends Component {
  state = {
    email: "",
    password: "",
    message: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { handleLogIn, history } = this.props;
    const { email, password } = this.state;

    Idm.login(email, password)
      .then((response) => {
        let resultCode = response["data"]["resultCode"];
        if (resultCode === 20) {
          handleLogIn(email, response["data"]["user_level"]);
          history.push("/");
        } else if (resultCode == 11) {
          this.setState({ message: "invalid email or password." });
        } else {
          this.setState({ message: "that email does not exists." });
        }
      })
      .catch((error) => console.log(error));
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
          <h1>Login</h1>
          <h2>Sign into your account</h2>
          <form onSubmit={this.handleSubmit}>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={this.updateField}
            />
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={this.updateField}
            />
            <button className="button">Login</button>
          </form>
          {message !== "" && <p style={{ color: "red" }}>{message}</p>}
          <p>
            Dont Have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </>
    );
  }
}

export default Login;
