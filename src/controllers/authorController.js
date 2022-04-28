const authorModel = require("../models/authorModel")

const createAuthors = async function(req,res) {


    try{
        let data = req.body
        let duplicate=await authorModel.findOne({email:data.email})
        if (duplicate) {
            return res.status(400).send({status:false,msg:'email already exists'})
        }
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
