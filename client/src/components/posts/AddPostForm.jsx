import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";

const AddPostForm = ({ addPost }) => {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    addPost({ body: text });

    setText("");
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form my-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          required=""
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

AddPostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(AddPostForm);
