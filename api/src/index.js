require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const dbConnect = require("./helpers/dbConnect");
const apllyAllRoutes = require("./routes");

const app = express();
app.use(express.json());
app.use(cors());

// routes
apllyAllRoutes(app);

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

try {
  app.listen(process.env.SERVER_PORT || 3005, () => {
    console.log("Server started on port: " + process.env.SERVER_PORT);

    dbConnect();
  });
} catch (err) {
  console.log(err);
}
