const User = require("../../database/model/user.model");
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
    // // Extract the token from the Authorization header
    // const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log(token);

    // if (!token) {
    //   return res.status(401).send("Access Denied: No Token Provided");
    // }

    // // Verify the token
    // const verified = jwt.verify(token, "process.env.JWT_SECRET_KEY");
    // if (verified) {
    //   return res.json({
    //     message: "Successfully Verified",
    //     user: verified,
    //   });
    // } else {
    //   return res.status(401).send("Access Denied: Token Verification Failed");
    // }
    console.log(req.user);
    return res.status(200).send(req.user);
  } catch (error) {
    return res.status(401).send("Access Denied: Invalid Token");
  }
};

module.exports = { getAllUser, signupUser, signinUser, getMe };
