import {Login } from "../controllers/signincontroller.js"
import express from "express";

const userRouter =express();
userRouter.post("/login", Login);


export default userRouter;