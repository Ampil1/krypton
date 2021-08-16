import {Schema } from 'mongoose';
import * as mongoose from 'mongoose';

export const BlogsSchema = new Schema({
    title: { type: String },
    content: { type: String },
    description: { type: String },
    contentMangerId:{ type: mongoose.Types.ObjectId, ref: 'Users' },
    images: { type: Object, default: {} },
    isPublish:{type: Boolean,default:false}

}, {
    timestamps: true
});
