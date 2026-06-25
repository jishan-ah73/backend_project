import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

//****************** GenerateAccess and Refresh Token *****************
const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went to wrong while generating Access and Refresh Token"
    );
  }
};

//*********************** Register Users ******************************
const registerUser = asyncHandler(async (req, res) => {
  // get users details from frontend
  // Velidation or not empty
  // check if users already exists username, email
  // check for Images, check for avatar
  // upload them to cloudinary
  // create user object - create entry in db
  // remove password and refresh token failed from response
  // check for user creation

  // get users details from frontend
  const { fullName, username, email, password } = req.body;

  //check Velidation or not empy
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check if users already exist username, email
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  // check for Images, check for avatar
  console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //    const coverLocalPath = req.files?.coverImage[0]?.path;

  let coverLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar fileds is required");
  }
  // upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar fileds is required");
  }
  // create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const creatUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!creatUser) {
    throw new ApiError(
      500,
      "Something went to worng while the registering the user "
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, creatUser, "User registered successfully"));
});

//*********************** Login Users *********************************
const loginUsers = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User logged In Successfully"
      )
    );
});

//*********************** Logout Users ********************************
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

//*********************** RefreshAccesToken ***************************
const refreshAccesToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessandRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

//*********************** CurrentPassword Change **********************
const CurrentPasswordChange = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Change Successfully"));
});

//*********************** GetCurrent User *****************************
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "current User fetch successfully"));
});

//*********************** UpdateAccount Details ***********************
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "All filed are required");
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details update successfully"));
});

//*********************** UpdateUser Avatar ***************************
const updateUserAvatar = asyncHandler(async(req, res) =>{
  const avatarLocalPath = req.file?.path;
  
  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if(!avatar.url){
    throw new ApiError(400, "Error while uploading on avatar")
  }

   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar: avatar.url
      }
    },
    {new : true}
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "Avatar update successfully") )
})

//*********************** UpdateUser CoverImage ***********************
const updateUserCoverImage = asyncHandler(async(req, res) =>{
  const coverLocalPath = req.file?.path;
  
  if(!coverLocalPath){
    throw new ApiError(400, "CoverImage file is missing")
  }

  const coverImage = await uploadOnCloudinary(coverLocalPath)

  if(!coverImage.url){
    throw new ApiError(400, "Error while uploading on avatar")
  }

   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage: coverImage.url
      }
    },
    {new : true}
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "coverImage update successfully"))
})

//*********************** UpdateUser CoverImage ***********************
const getUserChannelProfile = asyncHandler(async(req,res) =>{
  const {username} = req.params

  if(!username.trim()){
    throw new ApiError(400, "username is missting")
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase()
      }
    },
    {
      $lookup: {
        from : "Subscription",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from : "Subscription",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers"
        },
        channelSubcribedToCount:{
          $size: "subscribedTo"
        },
        isSubcribed:{
          $cond:{
            if: {$in: [req.user?._id, "subscribers.subscriber"]},
            then: true,
            else: false,
          }
        }
      }
    },
    {
      $project:{
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelSubcribedToCount: 1,
        isSubcribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1

      }
    }
  ])

  if(!channel?.length){
    throw new ApiError(404, "channel does not exist")
  }
  return res
  .status(200)
  .json(new ApiResponse(200, channel[0], "User Channel fetched successfully"))
})

export {
  registerUser,
  loginUsers,
  logoutUser,
  refreshAccesToken,
  CurrentPasswordChange,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage
};
