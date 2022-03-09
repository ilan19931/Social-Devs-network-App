import React, { Fragment } from "react";

import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { logout } from "../../actions/auth";

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>

      <li>
        <Link to="/register">Register</Link>
      </li>

      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  const userLinks = (
    <ul>
      <li>
        <Link to="/posts">Posts</Link>
      </li>

      <li>
        <Link to="/profiles">Developers</Link>
      </li>

      <li>
        <a href="#!" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i>
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h2>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h2>

      {!loading && (
        <Fragment>{isAuthenticated ? userLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
