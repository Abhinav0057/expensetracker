const express=require("express")
const authRouter=express.Router();

const {getAllUser,signupUser,signinUser,getMe}=require("../controller/Auth.Controller")



authRouter.get("/users",getAllUser);
authRouter.post("/singup",signupUser);
authRouter.post("/singin",signinUser);
authRouter.get("/me",getMe);




module.exports=authRouter