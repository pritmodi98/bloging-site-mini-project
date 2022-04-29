const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        ref: "Auhor"
    },
    tags: [String],
    category: {
        type: String,
        required: true
    },
    subCategory: [String],
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    deletedAt: {
                type:Date,
                default:null
            },
    publishedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

 module.exports = mongoose.model("blog",blogSchema)
