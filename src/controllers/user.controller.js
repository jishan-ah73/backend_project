import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/users.model.js";

const registerUser = asyncHandler(async(req, res) =>{
    // get users details from frontend
    // Velidation or not empty
    // check if users already exists username, email
    // check for Images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token failed from response
    // check for user creation 


     // get users details from frontend
    const {fullName, username, email, password} = req.body

    //check Velidation or not empy
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
   // check if users already exist username, email
   const existingUser = User.findOne({
    $or: [{username}, {password}]
   })
   if(existingUser){
    throw new ApiError(409, "User already exists");
   }
     // check for Images, check for avatar
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar fileds is required")
   }
})

export {registerUser}