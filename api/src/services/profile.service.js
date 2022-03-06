const mongoose = require("mongoose");

const request = require("request");
const axios = require("axios");
const {
    validationResult
} = require("express-validator");

const Profile = require("../models/profile.model");
const User = require("../models/user.model");


// @route   Get api/profile/me
// @desc    get profile from current user
// @access   Private
async function getCurrentProfile(req, res) {
    try {
        const profile = await Profile.findOne({
            user: req.user._id
        });
        if (!profile) {
            return res.status(400).send({
                errors: [{
                    msg: "user does'nt created profile yet."
                }]
            });
        }

        res.send(profile);

    } catch (err) {
        console.log(err);
        return res.status(500).send("server error");
    }
}


// @route   POST api/profile/
// @desc    update or create profile
// @access   Private
async function createOrUpdateProfile(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // Get fields
    const profileFields = {};
    profileFields.user = req.user;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;


    try {
        let profile = await Profile.findOne({
            user: req.user._id
        });

        if (profile) {
            profile = await Profile.findOneAndUpdate({
                user: req.user._id
            }, {
                $set: profileFields
            }, {
                new: true
            });

            return res.send(profile);
        }

        // create profile
        profile = new Profile(profileFields);
        await profile.save();

        res.send(profile);

    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }

}


// @route   GET api/profile/
// @desc    get all profiles
// @access  Public
async function getAllProfiles(req, res) {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);

        res.send(profiles);

    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }
}


// @route   GET api/profile/user/:user_id
// @desc    get profile by user id
// @access  Public
async function getProfileByUserId(req, res) {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).send({
                errors: [{
                    msg: "profile not found."
                }]
            });
        }

        res.send(profile);

    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(400).send({
                errors: [{
                    msg: "profile not found."
                }]
            });
        }

        console.log(err);
        return res.status(500).send({
            errors: [{
                msg: "Server Error"
            }]
        });
    }
}


// @route   DELETE api/profile/
// @desc    delete user, profile and posts by userID
// @access  Private
async function deleteUser(req, res) {
    try {
        // @todo - delete posts.

        //remove user
        const user = await User.findOneAndRemove({
            _id: req.user._id
        });
        //remove profile
        const profile = await Profile.findOneAndRemove({
            user: req.user._id
        });


        res.send({
            msg: "user deleted."
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            errors: [{
                msg: "Server Error"
            }]
        });
    }
}


// @route   PUT api/profile/experience
// @desc    add experience to profile
// @access  Private
async function addExperience(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({
            user: req.user._id
        });

        if (!profile) {
            return res.status(400).send({
                errors: [{
                    msg: "profile doesn't exists."
                }]
            });
        }

        profile.experience.unshift(newExp);

        await profile.save();

        res.send(profile);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }

}


// @route   DELETE api/profile/experience:exp_id
// @desc    delete experience from profile by exp_id
// @access  Private
async function deleteExperience(req, res) {
    const expId = req.params.exp_id;

    try {
        const profile = await Profile.findOne({
            user: req.user._id
        });

        if (!profile) {
            return res.status(400).send({
                errors: [{
                    msg: "profile doesn't exists."
                }]
            });
        }

        const filteredExp = profile.experience.filter((exp) => {
            if (exp._id.toString() !== expId) {
                return true;
            } else {
                return false;
            }
        });

        profile.experience = filteredExp;

        await profile.save();

        res.send(profile);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }
}


// @route   PUT api/profile/education
// @desc    add education to profile
// @access  Private
async function addEducation(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({
            user: req.user._id
        });

        if (!profile) {
            return res.status(400).send({
                errors: [{
                    msg: "profile doesn't exists."
                }]
            });
        }

        profile.education.unshift(newExp);

        await profile.save();

        res.send(profile);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }

}


// @route   DELETE api/profile/education:exp_id
// @desc    delete experience from profile by exp_id
// @access  Private
async function deleteEducation(req, res) {
    const eduId = req.params.edu_id;

    try {
        const profile = await Profile.findOne({
            user: req.user._id
        });

        if (!profile) {
            return res.status(400).send({
                errors: [{
                    msg: "profile doesn't exists."
                }]
            });
        }

        const filteredEducation = profile.education.filter((edu) => {
            if (edu._id.toString() !== eduId) {
                return true;
            } else {
                return false;
            }
        });

        profile.education = filteredEducation;

        await profile.save();

        res.send(profile);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }
}


// @route   GET api/profile/github/:username
// @desc    get github repos by username
// @access  Public
async function getGithubRepos(req, res) {
    const githubUsername = req.params.username;

    try {
        const options = {
            uri: `https://api.github.com/users/${githubUsername}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        }

        let url = `https://api.github.com/users/${githubUsername}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}`;

        const response = await axios.get(url, {
            headers: {
                'user-agent': 'node.js'
            }
        });

        if (response.status === 200) {
            res.send(response.data);
        } else {
            return res.status(400).send({
                errors: [{
                    msg: "can't get github repos."
                }]
            });

        }

    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }
}

module.exports = {
    getCurrentProfile,
    createOrUpdateProfile,
    getAllProfiles,
    getProfileByUserId,
    deleteUser,
    addExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
    getGithubRepos
};