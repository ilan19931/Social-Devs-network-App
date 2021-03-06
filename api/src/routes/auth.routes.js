const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const User = require("../models/user.model");

// @route   Get api/auth
// @desc    check authorization
// @access   Private
router.get("/", auth, async (req, res) => {
  const user = req.user;
  try {
    const foundUser = await User.find({ user: req.user._id });

    res.send(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      errors: [err],
    });
  }
});

module.exports = router;
