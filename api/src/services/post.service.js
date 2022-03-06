const mongoose = require("mongoose");
const {
    validationResult
} = require("express-validator");

const Post = require("../models/post.model");
const User = require("../models/user.model");


// @route   POST api/posts
// @desc    create new post
// @access   Private
async function addPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        });
    }


    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(400).send({
                errors: [{
                    msg: "user not found."
                }]
            });
        }

        const newPost = new Post({
            body: req.body.body,
            name: user.name,
            avatar: user.avatar,
            user: req.user._id
        });

        await newPost.save();

        res.send(newPost);

    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error.");
    }


}


// @route   GET api/posts
// @desc    get all posts
// @access   Private
async function getAllPosts(req, res) {
    try {
        const posts = await Post.find().sort({
            date: -1
        });

        if (!posts) {
            return res.status(400).send({
                errors: [{
                    msg: "there are no posts to show."
                }]
            });
        }

        res.send(posts);

    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error.");
    }
}


// @route   GET api/post/:post_id
// @desc    get post by id
// @access   Private
async function getPostById(req, res) {
    try {
        const post = await Post.findOne({
            _id: req.params.post_id
        });

        if (!post) {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            });
        }

        res.send(post);

    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            })
        }

        console.log(err);
        return res.status(500).send("Server Error.");
    }
}


// @route   DELETE api/post/:post_id
// @desc    delete post by id
// @access   Private
async function deletePostById(req, res) {
    try {
        const post = await Post.findOneAndDelete({
            user: req.user._id,
            _id: req.params.post_id
        });

        if (!post) {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            });
        }

        res.send(post);

    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            })
        }
        console.log(err);
        return res.status(500).send("Server Error.");
    }
}


// @route   PUT api/post/:post_id
// @desc    update post by id
// @access   Private
async function updatePostById(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        });
    }

    try {
        const newPost = {
            body: req.body.body
        }

        const post = await Post.findOneAndUpdate({
            user: req.user._id,
            _id: req.params.post_id
        }, {
            $set: newPost
        });

        if (!post) {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            });
        }

        post.body = req.body.body;
        res.send(post);

    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            })
        }
        console.log(err);
        return res.status(500).send("Server Error.");
    }
}


// @route   PUT api/post/like/:post_id
// @desc    like a post
// @access   Private
async function likePostById(req, res) {
    try {
        const post = await Post.findOne({
            user: req.user._id,
            _id: req.params.post_id
        });

        if (!post) {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            });
        }

        if (post.likes.filter(like => like.user?.toString() === req.user._id).length > 0) {
            return res.status(400).send({
                errors: [{
                    msg: "you have liked that post all ready."
                }]
            });
        }

        post.likes.unshift({
            user: req.user._id
        });

        await post.save();

        res.send(post.likes);

    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            })
        }
        console.log(err);
        return res.status(500).send("Server Error.");
    }
}


// @route   DELETE api/post/like/:post_id
// @desc    delete like (unlike) a post
// @access   Private
async function deleteLikeByPostId(req, res) {
    try {
        const post = await Post.findOne({
            user: req.user._id,
            _id: req.params.post_id
        });
        if (!post) {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            });
        }

        if (post.likes.length === 0) {
            return res.status(400).send({
                errors: [{
                    msg: "You have not liked the post."
                }]
            });
        }

        const cntLikes = post.likes.length;
        post.likes = post.likes.filter(like => like.user.toString() !== req.user._id);

        // if like been removed
        if (cntLikes !== post.likes) {
            await post.save();

            res.send({
                msg: "unlike success."
            });
        } else {
            res.status(400).send({
                errors: [{
                    msg: "the user has not liked the post."
                }]
            });
        }

    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            })
        }
        console.log(err);
        return res.status(500).send("Server Error.");
    }
}


// @route   POST api/comments/:post_id
// @desc    create new comment in post
// @access   Private
async function addComment(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        });
    }


    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(400).send({
                errors: [{
                    msg: "user not found."
                }]
            });
        }

        const post = await Post.findOne({
            user: req.user._id,
            _id: req.params.post_id
        });
        if (!post) {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            });
        }

        const newComment = {
            body: req.body.body,
            name: user.name,
            avatar: user.avatar,
            user: req.user._id
        };

        post.comments?.unshift(newComment);


        await post.save();

        res.send(post.comments);

    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error.");
    }
}


// @route   DELETE api/post/comment/:post_id/:comment_id
// @desc    delete like (unlike) a post
// @access   Private
async function deleteComment(req, res) {
    try {
        const post = await Post.findOne({
            user: req.user._id,
            _id: req.params.post_id
        });
        if (!post) {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            });
        }

        if (post.comments.length === 0) {
            return res.status(400).send({
                errors: [{
                    msg: "You have not commented in that post."
                }]
            });
        }

        const cntComments = post.comments.length;
        post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.comment_id);

        // if like been removed
        if (cntComments !== post.comments.length) {
            await post.save();

            res.send({
                msg: "comment success."
            });
        } else {
            res.status(400).send({
                errors: [{
                    msg: "the user has not commented in that post."
                }]
            });
        }

    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).send({
                errors: [{
                    msg: "post not found."
                }]
            })
        }
        console.log(err);
        return res.status(500).send("Server Error.");
    }
}

module.exports = {
    addPost,
    getAllPosts,
    getPostById,
    deletePostById,
    updatePostById,
    likePostById,
    deleteLikeByPostId,
    addComment,
    deleteComment
};