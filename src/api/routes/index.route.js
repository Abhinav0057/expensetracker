const express=require("express")
const authRouter =require("./auth.routes")
const indexRouter=express.Router();




indexRouter.use("/auth",authRouter)


module.exports=indexRouter