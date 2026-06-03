const express = require("express");
const {registerUserController, loginUserController, logoutUserController, getMeController} = require("../controllers/auth.controller.js");
const {authUser} = require("../middleware/auth.middleware.js");
const authRouter = express.Router();

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);
authRouter.post("/logout", logoutUserController);
authRouter.get("/getme", authUser, getMeController);

module.exports = authRouter;