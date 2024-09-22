import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

import { v2 as cloudinary } from 'cloudinary';

// (async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

const uploadOnCloudinary = async (localFilePath) => {
    try {
            if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        //file has been uploaded suceessfully
        console.log("file uploaded successfully",
            response.url
        )
            return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)//remove the saved temporary file as the uplod operation got failed
            console.error(error);
        throw error;
        return null
        }
    }
    export{uploadOnCloudinary} 
