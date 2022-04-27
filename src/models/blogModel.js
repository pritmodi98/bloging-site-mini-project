const mongoose = require('mongoose');
const ObjectId = mongoose.schema.type.ObjectId

const blogSchema = new mongoose.schema({

    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
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
        type: Date,
        default: Date.now()
    },
    publishedAt: {
        type: Date,
        default: Date.now()
    }


}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema)
