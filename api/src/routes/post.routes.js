const express = require("express");
const router = express.Router();

const { check } = require("express-validator");

const auth = require("../middleware/auth");
const postService = require("../services/post.service");

// @route   POST api/posts
// @desc    create new post
// @access   Private
router.post(
  "/",
  [auth, [check("body", "Body is required.").not().isEmpty()]],
  async (req, res) => await postService.addPost(req, res)
);

// @route   GET api/posts
// @desc    get all posts
// @access   Private
router.get(
  "/",
  [auth],
  async (req, res) => await postService.getAllPosts(req, res)
);

// @route   GET api/posts/:post_id
// @desc    get post by id
// @access   Private
router.get(
  "/:post_id",
  [auth],
  async (req, res) => await postService.getPostById(req, res)
);

// @route   DELETE api/posts/:post_id
// @desc    delete post by id
// @access   Private
router.delete(
  "/:post_id",
  [auth],
  async (req, res) => await postService.deletePostById(req, res)
);

// @route   PUT api/posts/:post_id
// @desc    update post by id
// @access   Private
router.put(
  "/:post_id",
  [auth, [check("body", "body is required.").not().isEmpty()]],
  async (req, res) => await postService.updatePostById(req, res)
);

// @route   PUT api/posts/like/:post_id
// @desc    like a post
// @access   Private
router.put(
  "/like/:post_id",
  [auth],
  async (req, res) => await postService.likePostById(req, res)
);

// @route   DELETE api/posts/like/:post_id
// @desc    delete like (unlike) a post
// @access   Private
router.delete(
  "/like/:post_id",
  [auth],
  async (req, res) => await postService.deleteLikeByPostId(req, res)
);

// @route   POST api/posts/comments/:post_id
// @desc    create new comment in post
// @access   Private
router.post(
  "/comments/:post_id",
  [auth, [check("body", "Body is required.").not().isEmpty()]],
  async (req, res) => await postService.addComment(req, res)
);

// @route   DELETE api/posts/comments/:post_id/:comment_id
// @desc    delete like (unlike) a post
// @access   Private
router.delete(
  "/comments/:post_id/:comment_id",
  [auth],
  async (req, res) => await postService.deleteComment(req, res)
);

module.exports = router;
