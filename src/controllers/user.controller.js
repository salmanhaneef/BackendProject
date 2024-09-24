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

//1
    const { fullName, email, username, password } = req.body
    console.log("email", email)
    // if (fullname === "") {
    //     throw new ApiError("Full name is required", 400)
    // }
    //2
    if ([fullName, email, username, password].some((field) => 
        field?.trim() === ""
    )) {
        throw new ApiError(400,"All fields are required")
    }
    //3
    const existedUser =await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }
    //4
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
        
    }

    if (!avatarLocalPath) { 
        throw new ApiError(400, "Please provide an avatar image")
    }
    //5
    const avatar = await uploadOnCloudinary(avatarLocalPath, coverImageLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) { 
        throw new ApiError(400, "Failed to upload avatar image")
    }
    //6
    const user=await User.create({
        fullName,
        email,
        username : username.toLowerCase (),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })
    //7
    const createdUser = await User.findById(user._id).select(
       "-password -refreshToken"
    )
    if (!createdUser) {
        throw new Error(500,"Something went wrong while registering the user")
    }
    //8
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )

})

export{registerUser}