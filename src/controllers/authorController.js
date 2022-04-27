const authorModel = require("../models/authorModel")

const createAuthors = async function(req,res) {


    try{
        let data = req.body
        let newData = await authorModel.create(data)

        res.status(200).send({message:newData})
        console.log(data)
    }
    catch(err){
        console.log('this is the error :',err.message )
        res.status(500).send({msg:"Error", error : err.message})
    }
}


module.exports.createAuthors = createAuthors
