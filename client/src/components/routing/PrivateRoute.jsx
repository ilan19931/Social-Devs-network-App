import React from "react";

import { connect } from "react-redux";

import { Navigate } from "react-router-dom";

const PrivateRoute = ({ auth, element }) => {
  return !auth.loading && !auth.isAuthenticated ? (
    <Navigate to="/login" />
  ) : (
    element
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
