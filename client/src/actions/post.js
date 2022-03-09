import axios from "axios";
import { setAlert } from "./alert";

import {
  DELETE_POST,
  GET_POSTS,
  POSTS_ERROR,
  UPDATE_LIKES,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  DELETE_COMMENT,
} from "./types";

// get all posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts");

    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response.data.errors, status: err.response.status },
    });
  }
};

// get post - by post id
export const getPost = (postId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${postId}`);

    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response.data.errors, status: err.response.status },
    });
  }
};

// Add a post
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/posts/`, formData);

    dispatch({
      type: ADD_POST,
      payload: res.data,
    });

    dispatch(setAlert("post added.", "success"));
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response.data.errors, status: err.response.status },
    });
  }
};

// delete a post
export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${postId}`);

    dispatch({
      type: DELETE_POST,
      payload: postId,
    });

    dispatch(setAlert("post removed.", "success"));
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response.data.errors, status: err.response.status },
    });
  }
};

// like a post
export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {
        postId,
        likes: res.data,
      },
    });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response.data.errors, status: err.response.status },
    });
  }
};

// remove like from post
export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/posts/like/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {
        postId,
        likes: res.data,
      },
    });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response.data.errors, status: err.response.status },
    });
  }
};

// comment in a post
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/posts/comments/${postId}`, formData);

    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });

    dispatch(setAlert("comment created", "success"));
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response.data.errors, status: err.response.status },
    });
  }
};

// delete comment from post
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/comments/${postId}/${commentId}`);

    dispatch({
      type: DELETE_COMMENT,
      payload: commentId,
    });

    dispatch(setAlert("comment deleted", "success"));
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response.data.errors, status: err.response.status },
    });
  }
};
