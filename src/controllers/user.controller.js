import {  asyncHnadler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'; 
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import{ApiResponse} from '../utils/ApiResponse.js'
const registerUser = asyncHnadler(async (req, res) => {
    //get user information from frontend
    // validation not empty
    // check if user is already registered
    //check for images,check for avatar
    // upload for cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for use creation
    //return response


    const { fullname, email, username, password } = req.body
    console.log("email", email)
    // if (fullname === "") {
    //     throw new ApiError("Full name is required", 400)
    // }
    if ([fullname, email, username, password].some((field) => 
        field?.trim() === ""
    )) {
        throw new ApiError(400,"All fields are required")
    }
    const existedUser =User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) { 
        throw new ApiError(400, "Please provide an avatar image")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath, coverImageLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) { 
        throw new ApiError(400, "Failed to upload avatar image")
    }
    const user=await User.create({
        fullname,
        email,
        username : username.toLowerCase (),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })
    const createdUser = await User.findById(user._id).select(
       "-password -refreshToken"
    )
    if (createdUser) {
        throw new Error(500,"Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )

})

export{registerUser}