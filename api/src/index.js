require("dotenv").config();
const express = require("express");


const dbConnect = require("./helpers/dbConnect");
const apllyAllRoutes = require("./routes");

const app = express();
app.use(express.json());

// routes
apllyAllRoutes(app);




try {
app.listen(process.env.SERVER_PORT, () => {
    console.log("Server started on port: " + process.env.SERVER_PORT);

    dbConnect();
});
} catch(err) {
    console.log(err);
}