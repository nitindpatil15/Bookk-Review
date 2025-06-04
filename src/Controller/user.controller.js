import { User } from "../Model/User.js";
import bcrypt from "bcrypt"
import { ApiError } from "../Utils/ApiError.js";

// Generate AccessToken Functionality
export const accesstokenGenerate = async (userId) => {
  try {
    const userToken = await User.findById(userId);
    const accessToken = userToken.generateAccessToken();
    console.log("From genrate accessToken", accessToken);
    return { accessToken };
  } catch (error) {
    return next(new ApiError(500, error?.message || "Server Error"));
  }
};

// User registration
export const UserRegister = async (req,res,next) => {
  try {
    const {
      name,
      mobile,
      email,
      password
    } = req.body;
    if (!name || !mobile || !email || !password) {
      return next(new ApiError(400, "All fields are required."));
    }

    const existedUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existedUser) {
      return next(new ApiError(401, "Mobile.No or Email already exists."));
    }

    const createduser = await User.create({
      name,
      email,
      password,
      mobile,
    });
    await createduser.save();
    console.log(createduser);
    if (!createduser) {
      return next(new ApiError(402, "Failed to create User."));
    }
    const user = await User.findById(createduser?._id).select("-password");

    return res
      .status(200).json({message:"User fetched Successfully",data:user})
  } catch (error) {
    return next(new ApiError(500, error?.message || "Server Error"));
  }
};

// Fetch Current User
export const getCurrentUser = async (req,res,next) => {
  const user = req.user._id;
  try {
    const response = await User.findById(user);
    if (!response) {
      return next(new ApiError(401, "User not Found"));
    }
    console.log(response);
    return res
      .status(200)
      .json((200, response, "Fetched current User"));
  } catch (error) {
    return next(new ApiError(500, error?.message || "Server Error"));
  }
};

export const login = async (req,res,next) => {
  const { email, mobile, password } = req.body;
  if (!password || (!mobile && !email)) {
    console.log("All Fields are Required.");
    return next(new ApiError(401, "All Fields are Required."));
  }
  try {
    const userDetail = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    if (!userDetail) {
      console.log("Mobile.No or Email Not exists.");
      return next(new ApiError(402, "Mobile.No or Email Not exists."));
    }
    const isValidPassword = await bcrypt.compare(password, userDetail.password);
    if (!isValidPassword) {
      console.log("Invalid Password");
      return next(new ApiError(402, "Invalid Password"));
    }

    const { accessToken } = await accesstokenGenerate(userDetail._id);
    console.log(accessToken);
    const loggedUser = await User.findById(userDetail._id).select("-password");

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .json(
          {data:{ loggedUser, accessToken },
          message:"User Logged In Successfully"}
      );
  } catch (error) {
    console.log(error);
    return next((500, error?.message || "Server Error."));
  }
};

export const userlogout = async (req,res,next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(401, "Unauthorized User"));
    }
    return res
      .status(200)
      .clearCookie("accessToken")
      .json({status:200, message:"User logged out successfully"});
  } catch (error) {
    return next(new ApiError(500, error?.message || "Server Error"));
  }
};