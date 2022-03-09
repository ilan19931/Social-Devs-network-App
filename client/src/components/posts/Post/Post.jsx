import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getPost } from "../../../actions/post";
import { useParams } from "react-router-dom";

import PostItem from "../PostItem";
import CommentItem from "./CommentItem";
import { Spinner } from "../../index";
import AddCommentForm from "./AddCommentForm";

const Post = ({ getPost, post: { post, loading } }) => {
  const params = useParams();

  useEffect(() => {
    getPost(params.postId);
  }, [getPost]);

  return (
    <div className="container">
      <Link to="/posts" className="btn">
        Back to posts
      </Link>
      {loading || post === null ? (
        <Spinner />
      ) : (
        <>
          <PostItem post={post} showActions={false} />
          <AddCommentForm postId={params.postId} />

          <div className="comments">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  postId={params.postId}
                />
              ))
            ) : (
              <h4>There are no comments</h4>
            )}
          </div>
        </>
      )}
    </div>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
