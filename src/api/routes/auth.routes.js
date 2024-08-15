const express = require("express");
const authRouter = express.Router();
const {
  authenticateUser,
} = require("../../infrastrcuture/Middleware/Auth/Auth.Middlware");

const {
  getAllUser,
  signupUser,
  signinUser,
  getMe,
  sendFriendRequest,
  respondToFriendRequest
} = require("../controller/Auth.Controller");

authRouter.get("/users", getAllUser);
authRouter.post("/singup", signupUser);
authRouter.post("/singin", signinUser);
authRouter.get("/me", authenticateUser, getMe);
authRouter.get("/sendfriendrequest", authenticateUser, sendFriendRequest);
authRouter.get("/respondtofriendrequest", authenticateUser, respondToFriendRequest);

module.exports = authRouter;
