import mongoose from "mongoose";

const subsciptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref :"User"
    },
    subscriber: {
        type: Schema.Types.ObjectId,
        ref :"User"
    },
}, { timestamps: true })
export const  Subsciption = mongoose.model('Subscription',subsciptionSchema)