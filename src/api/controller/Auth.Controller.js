const { User, FriendRequest } = require("../../database/model/user.model");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../../infrastrcuture/Middleware/Auth/Auth.Middlware");

const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "users not found" });
  }
  return res.status(200).json({ users: users });
};
const signupUser = async (req, res, next) => {
  let user;
  let { name, email, password } = req.body;
  try {
    user = await User.find(email);
  } catch (err) {
    console.log(err);
  }
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password);
    const newuser = new User({
      name,
      email,
      password: hashedPassword,
      income: [],
      expenses: [],
    });
    try {
      newuser.save();
      return res.status(201).json({ newuser });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};
const signinUser = async (req, res, next) => {
  let { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "An error occurred while finding the user" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password!" });
  }

  const jwtSecretKey = "process.env.JWT_SECRET_KEY";
  const token = jwt.sign(
    { id: existingUser._id, email: existingUser.email },
    jwtSecretKey,
    { expiresIn: "1w" }
  );
  return res.status(200).send({ token });
};

const getMe = async (req, res, next) => {
  try {
    console.log(req.user);
    return res.status(200).send(req.user);
  } catch (error) {
    return res.status(401).send("Access Denied: Invalid Token");
  }
};

const sendFriendRequest = async (req, res, next) => {
  let { senderId, receiverId } = req.body;
  const existinrRequest = await FriendRequest.findOne({
    sender: senderId,
    receiver: receiverId,
    status: "pending",
    is_deleted: false,
  });
  // note: rejectd condn herya chaina easma
  if (existinrRequest) {
    return res.status(401).send("Request already sent");
  }
  const friendRequest = new FriendRequest({
    sender: senderId,
    receiver: receiverId,
  });
  await friendRequest.save();
  return res
    .status(201)
    .send({ message: "Friend Request sent", data: friendRequest });
};

const respondToFriendRequest = async (req, res, next) => {
  let { requestId, status } = req.body;
  const friendRequest = FriendRequest.findById(findById);
  if (!friendRequest) {
    res.status(400).send({ message: "Cannot find request" });
  }
  if (friendRequest.status !== "pending") {
    res.status(400).send({ message: "Request already processed" });
  }
  friendRequest.status = status;
  await friendRequest.save();
  if (status === "accepted") {
    await User.findByIdAndUpdate(friendRequest.sender, {
      $push: { friends: friendRequest.receiver },
    });
    await User.findByIdAndUpdate(friendRequest.receiver, {
      $push: { friends: friendRequest.sender },
    });
  }
  return res.status(201).send({message:`Friend request ${status}`})
};

module.exports = { getAllUser, signupUser, signinUser, getMe,sendFriendRequest,respondToFriendRequest };
