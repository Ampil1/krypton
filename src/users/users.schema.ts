import { Schema } from 'mongoose';


export const UserSchema = new Schema({
    fullNmae: { type: String },
    email: { type: String, trim: true, lowercase: true, sparse: true },
    password: { type: String },
    salt: { type: String },
    role: { type: String },
    images: { type: Object,default:{} },
    skills: { type: Array, default: [] }

}, {
    timestamps: true
});
