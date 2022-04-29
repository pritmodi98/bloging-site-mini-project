const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema( {
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },

    tittle : {
        type:String,
        required:true,
        enum:['Mr','Mrs','Miss']
    },

    email : {
        type:String,
        required:true,
        unique:true,
     
    },

    password: {
        type:String,
        required:true
    }

    
}, { timestamps: true });

module.exports = mongoose.model('newAuthor', authorSchema)