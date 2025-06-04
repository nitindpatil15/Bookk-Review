import { User } from "../Model/User.js";
import bcrypt from "bcrypt"

export const accesstokenGenerate = async (userId) => {
  try {
    const userToken = await User.findById(userId);
    const accessToken = userToken.generateAccessToken();
    console.log("From genrate accessToken", accessToken);
    return { accessToken };
  } catch (error) {
    return res.json(({status:500, message:error?.message || "Server Error"}));
  }
};

export const UserRegister = async (req,res) => {
  try {
    const {
      name,
      mobile,
      email,
      password
    } = req.body;
    if (!name || !mobile || !email || !password) {
      return res.json({status:400, message:"All fields are required."});
    }

    const existedUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existedUser) {
      return res.json({status:401, message:"Mobile.No or Email already exists."});
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
      return res.json({status:402, message:"Failed to create User."});
    }
    const user = await User.findById(createduser?._id).select("-password");

    return res
      .status(200).json({message:"User Registered Successfully",data:user})
  } catch (error) {
    return res.json({status:500,message: error?.message || "Server Error"});
  }
};

export const getCurrentUser = async (req,res) => {
  const user = req.user._id;
  try {
    const response = await User.findById(user);
    if (!response) {
      return res.json({status:401,message: "User not Found"});
    }
    console.log(response);
    return res
      .status(200)
      .json((200, response, "Fetched current User"));
  } catch (error) {
    return res.json({status:500, message:error?.message || "Server Error"});
  }
};

export const login = async (req,res) => {
  const { email, mobile, password } = req.body;
  if (!password || (!mobile && !email)) {
    console.log("All Fields are Required.");
    return res.json({status:401, message:"All Fields are Required."});
  }
  try {
    const userDetail = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    if (!userDetail) {
      console.log("Mobile.No or Email Not exists.");
      return res.json({status:402, message:"Mobile.No or Email Not exists."});
    }
    const isValidPassword = await bcrypt.compare(password, userDetail.password);
    if (!isValidPassword) {
      console.log("Invalid Password");
      return res.json({status:402, message:"Invalid Password"});
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
    return res.json((500, error?.message || "Server Error."));
  }
};

export const userlogout = async (req,res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({status:401, message:"Unauthorized User"});
    }
    return res
      .status(200)
      .clearCookie("accessToken")
      .json({status:200, message:"User logged out successfully"});
  } catch (error) {
    return res.json({status:500, message:error?.message || "Server Error"});
  }
};