import React, { Component } from "react";
import { NavLink, Navlink } from "react-router-dom";
import "../css/navbar.css";

export default class NavBar extends Component {
  render() {
    const { handleLogOut, loggedIn, securityLevel } = this.props;
    return (
      <>
        <nav className="nav-bar">
          <NavLink className="nav-link home" to="/">
            Secrets
          </NavLink>
          <div className="nav">
            <NavLink className="nav-link" to="/post">
              Post
            </NavLink>
            {!loggedIn && (
              <>
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </>
            )}
            {loggedIn && (
              <>
                <NavLink className="nav-link" to="/saved">
                  Saved
                </NavLink>
                {securityLevel < 3 && (
                  <NavLink className="nav-link" to="/moderate">
                    Moderator Dashboard
                  </NavLink>
                )}
                <NavLink onClick={handleLogOut} className="nav-link" to="/">
                  Logout
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </>
    );
  }
}
