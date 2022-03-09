import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";

import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";

import PrivateRoute from "./components/routing/PrivateRoute";

import {
  Navbar,
  Landing,
  Login,
  Register,
  Alert,
  Dashboard,
  AddEducation,
  AddExperience,
  ProfileForm,
  Profiles,
  Profile,
  Posts,
  Post,
} from "./components";
import React, { useEffect } from "react";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <>
      <Provider store={store}>
        <Router>
          <Navbar />
          <Alert />
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/profiles" element={<Profiles />} />
            <Route exact path="/profile/:id" element={<Profile />} />

            {/* PRIVATE ROUTES (NEED TO AUTH) */}

            <Route
              exact
              path="/dashboard"
              element={<PrivateRoute element={<Dashboard />} />}
            />
            <Route
              exact
              path="/create-profile"
              element={<PrivateRoute element={<ProfileForm />} />}
            />
            <Route
              exact
              path="/edit-profile"
              element={<PrivateRoute element={<ProfileForm />} />}
            />
            <Route
              exact
              path="/add-experience"
              element={<PrivateRoute element={<AddExperience />} />}
            />
            <Route
              exact
              path="/add-education"
              element={<PrivateRoute element={<AddEducation />} />}
            />

            <Route
              exact
              path="/posts"
              element={<PrivateRoute element={<Posts />} />}
            />

            <Route
              exact
              path="/post/:postId"
              element={<PrivateRoute element={<Post />} />}
            />
          </Routes>
        </Router>
      </Provider>
    </>
  );
};

export default App;
