const userRoutes = require("./user.routes");
const authRoute = require("./auth.routes");
const profileRoutes = require("./profile.routes");

module.exports = (app) => {
    app.use('/api/user', userRoutes);

    app.use('/api/auth', authRoute);

    app.use('/api/profile/', profileRoutes);
}