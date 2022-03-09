import React, { useState } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { addComment } from "../../../actions/post";

const AddCommentForm = ({ addComment, postId }) => {
  const [body, setBody] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    addComment(postId, { body });

    setBody("");
  }

  return (
    <div className="container">
      <div className="bg-primary p">
        <h3>Leave A Comment</h3>
      </div>

      <form onSubmit={handleSubmit} method="POST" className="form my-1">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          name="text"
          cols="30"
          rows="5"
          placeholder="Comment on this post"
          required=""
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

AddCommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  postId: PropTypes.object.isRequired,
};

export default connect(null, { addComment })(AddCommentForm);
