import {  asyncHnadler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'; 
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"
//genrate refresh and access token
const generateAccessandRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: true })
        return{accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while genrating access and refresh token")
    }
}

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

const loginUser = asyncHnadler(async (req, res) => {
    //req body -> data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookies
    // and return reponse
    const { email, username, password } = req.body
    console.log(email)
    if (!email && !username) { 
        throw new ApiError(400,"username || email is required")
    }
    //Here is an alternative  of above code based on logic discussion
    // if (!(username || !password)) { 
    //     throw new ApiError(400,"username ||email or password is required")
    // }
    const user =await User.findOne({
        $or :[{username},{email}]
    })
    if (!user) {
        throw new ApiError(404,"User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401,"Incorrect password")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refresh-token")

    const options = {
        
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
            user: loggedInUser,accessToken,
            refreshToken  
        },
         "User logged in successfully"
    ));
})

const logoutUser = asyncHnadler(async (req, res) => {
    //remove cookies
    //and return response
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
            refreshToken:undefined
            }
        },
        {
            new: true
        }
        
    )
    const options = {
        httpOnly: true,
        secure: true 
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200,{}, "User logged out successfully")
    );
})

const refreshAccessToken = asyncHnadler(async (req, res) => { 
    //get refresh token from cookies
    //decode the refresh token
    //validate refresh token
    //generate new access token
    //send new access token to client
    // and return response
    const incomingRefreshToken = req.cookies.refreshToken ||req.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "No valid refresh token found")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,
            process.env.REFREH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token has expired")
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken,newrefreshToken}=  await generateAccessandRefreshToken(user._id)
        return res
           .status(200)
            .cookie("accessToken", accessToken,options)
            .cookie("refreshToken", newrefreshToken, options)
           .json(new ApiResponse(200, { accessToken, refreshToken:newrefreshToken }, "Access token refreshed successfully"))
    } catch (error) {
        throw new ApiError(401, error?.message,"Invalid refresh token")
    }
 
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}