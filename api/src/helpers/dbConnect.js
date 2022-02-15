const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect(process.env.MONGODB_URL, (err) => {
        if(!err) {
            console.log("connected to mongodb");
        } else {
            console.log(err);
        }
    });
}