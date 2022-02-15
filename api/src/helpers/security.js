const jwt = require("jsonwebtoken");

async function createToken(user){
    try {
        if(user.password) {
            user.password = undefined;
        }
        
        const token = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '7d'});

        return token;

    } catch(err) {
        console.log(err);
    }
}


module.exports = {createToken};