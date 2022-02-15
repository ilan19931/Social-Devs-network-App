const {createToken} = require("../helpers/security");
const bcrypt = require("bcrypt");
const gravatar =  require("gravatar");

const {validationResult} = require("express-validator");

const security = require("../helpers/security");
const User = require("../models/user.model");

// create new user
async function createUser(req,res){
    const {name, email, password} = req.body;
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
    }

    const foundEmail = await User.findOne({email: email});
    if(foundEmail) {
        return res.status(400).send({errors:[{msg: "email is taken"}]});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const avatar = gravatar.url(email, {s: '200', r: 'pg', d: 'mm'});

    const user = new User({
        name,
        email,
        password: hashedPassword,
        avatar
    });

    await user.save();
    console.log(email + " user created.");
    
    const token = await createToken(user);
    res.send({token});
}


async function login(req,res){
    const {email, password} = req.body;

    if(!(email && password)) {
        return res.status(400).send({errors:[{msg: "there are empty fields"}]});
    }

    try {
        const foundUser = await User.findOne({email});
        if(foundUser) {
            const passwordMatch = await bcrypt.compare(password, foundUser.password);
            if(passwordMatch){
                const token = await security.createToken(foundUser);
                console.log(email + " logged in.");

                return res.send({token});
            }
        }
    } catch(err) {
        console.log(err);
        return res.status(400).send({errors:[err]});
    }

    res.status(400).send({errors:[{msg: "wrong details"}]});
}

module.exports = {createUser, login};