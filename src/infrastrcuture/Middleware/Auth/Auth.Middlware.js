const jwt = require("jsonwebtoken");
const User = require("../../../database/model/user.model"); // Adjust the path to your User model

const authenticateUser = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
      return res.status(401).send("Access Denied: No Token Provided");
    }

    // Verify the token
    const verified = jwt.verify(token, "process.env.JWT_SECRET_KEY");
    if (!verified) {
      return res.status(401).send("Access Denied: Invalid Token");
    }
    console.log(verified);

    // Check if the user exists in the database
    const user = await User.findById(verified.id);
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    // Attach user to the request object
    req.user = verified;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).send("Access Denied: Invalid Token");
  }
};

module.exports = { authenticateUser };
