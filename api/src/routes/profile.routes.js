const express = require("express");
const router = express.Router();
const {
    check
} = require("express-validator");

const profileService = require("../services/profile.service");
const auth = require("../middleware/auth");


// @route   Get api/profile/me
// @desc    get profile from current user
// @access   Private
router.get("/me", auth, async (req, res) => (await profileService.getCurrentProfile(req, res)));


// @route   POST api/profile/
// @desc    update or create profile
// @access   Private
router.post("/", [auth, [
    check('status', 'status are required').not().isEmpty(),
    check('skills', 'skills are required').not().isEmpty(),
]], async (req, res) => (await profileService.createOrUpdateProfile(req, res)));


// @route   GET api/profile/
// @desc    get all profiles
// @access  Public
router.get("/", async (req, res) => (await profileService.getAllProfiles(req, res)));

// @route   GET api/profile/user/:user_id
// @desc    get profile by user id
// @access  Public
router.get("/user/:user_id", async (req, res) => (await profileService.getProfileByUserId(req, res)));


// @route   DELETE api/profile/
// @desc    delete user, profile and posts by userID
// @access  Private
router.delete("/", auth, async (req, res) => (await profileService.deleteUser(req, res)));


// @route   PUT api/profile/experience
// @desc    add experience to profile
// @access  Private
router.put("/experience", [auth, [
    check('title', 'title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From is required').not().isEmpty()
]], async (req, res) => (await profileService.addExperience(req, res)));


// @route   DELETE api/profile/experience:exp_id
// @desc    delete experience from profile by exp_id
// @access  Private
router.delete("/experience/:exp_id", auth, async (req, res) => (await profileService.deleteExperience(req, res)));


// @route   PUT api/profile/education
// @desc    add education to profile
// @access  Private
router.put("/education", [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Company is required').not().isEmpty(),
    check('fieldofstudy', 'Field Of Study is required').not().isEmpty()
]], async (req, res) => (await profileService.addEducation(req, res)));


// @route   DELETE api/profile/education:exp_id
// @desc    delete experience from profile by exp_id
// @access  Private
router.delete("/education/:edu_id", auth, async (req, res) => (await profileService.deleteEducation(req, res)));


// @route   GET api/profile/github/:username
// @desc    get github repos by username
// @access  Public
router.get("/github/:username", async (req, res) => (await profileService.getGithubRepos(req, res)));



module.exports = router;