import { ApiError } from "../utils/apiError.js";
import { asyncHnadler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHnadler(async(req, 
    _, next) => { 
//sometimes access token are not given  beacuse in the mobile application access token is not given
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        if (!token) {
            throw new ApiError(401, "Access denied, please login");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_Token_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            
            throw new ApiError(401, "Invalid access token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
    //if token is valid we will set req.user and move to the next middleware or controller


})