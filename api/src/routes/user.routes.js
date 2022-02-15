const express = require("express");
const router = express.Router();

const {check} = require("express-validator");

const userService = require("../services/user.service");

// @route   Post api/user/createUser
// @desc    create new user. get token
// @access   Public
router.post("/createUser",[
    check('name', "name is required").not().isEmpty(),
    check('email', "must be valid email").isEmail(),
    check('password', "password must be at least 4 characters").isLength({min: 4}),
], async (req, res) => (await userService.createUser(req,res)));


// @route   Post api/user/login
// @desc    login to app. get token
// @access   Public
router.post("/login",[
    check('email', "must be valid email").isEmail(),
    check('password', "password is required").exists(),
], async (req, res) => (await userService.login(req,res)));


module.exports = router;