import jwt from "jsonwebtoken";
import { User } from "../Model/User.js";

const authentication = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    console.log("Token from Middleware:", token);
    if (!token) {
      return next( new Error("Unauthorized User"))
    }
    const decodedUser = jwt.verify(token, process.env.ACCESSTOKEN_SECRET_KEY);
    if (!decodedUser) {
      return next( new Error("Invalid Token"));
    }

    const selectUser = await User.findById(decodedUser?._id).select(
      "-password"
    );
    if (!selectUser) {
      return next(new Error("User Not Found"))
    }
    req.user = selectUser;
    console.log("Authorized User", selectUser);
    next();
  } catch (error) {
    return next( new Error(error?.message || "Server Error"));
  }
};

export default authentication;
