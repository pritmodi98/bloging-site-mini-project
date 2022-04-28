const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const mongoose = require('mongoose');
const ObjectId= mongoose.Types.ObjectId

const createBlog = async function (req, res) {
    try {
        let blog = req.body
        let authorId = blog.authorId
        let auth = await authorModel.findById(authorId)
        if (!auth) { return res.status(400).send({ msg: "authorId invalid" }) }

      let blogCreated = await blogModel.create(blog)
        res.status(201).send({ status: true, data: blogCreated })


    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const isValidData=function(data){
    if(typeof data==='string' && data.trim().length===0)
        return false
    return true
}

const getBlog=async function(req,res){
    try{
        let filteredData={isDeleted:false,isPublished:true}
        let data=req.query
        
        if(data.authorId && isValidData(data.authorId)){
            const valid=ObjectId.isValid(data.authorId)

            if(valid)
            {
                filteredData["authorId"]=data.authorId
            }
        }
        if(data.category && isValidData(data.category)){
            if(isValidData(data.category))
                filteredData["category"]=data.category
        }
        if(data.subCategory && isValidData(data.subCategory)){
            const subArray=data['subCategory'].trim().split(",").map(val=>val.trim())
            filteredData["subcategory"]={$all:subArray}
        }
        if(data.tags && isValidData(data.tags)){
            const tagArray=data['tags'].trim().split(",").map(val=>val.trim())
            filteredData["tags"]={$all:tagArray}
        }
        
        let BlogDetails=await blogModel.find(filteredData)
        if(BlogDetails.length===0)
        {
            res.status(404).send({status:false,msg:"blogs are not present"})
        }
        else{
            res.status(200).send({status:true,data:BlogDetails})
        }
    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }

}

const deleteBlog=async function(req,res){
    try{
        let blogId=req.params.blogId
    
        let isValidId=ObjectId.isValid(blogId)
        if(!isValidId){
            return res.status(400).send({status:false,msg:"blogid is not valid"})
        }

        const id=ObjectId(blogId)
        
        let blog=await blogModel.findOne({_id:id,isDeleted:false})
        if(!blog)
        {
            return res.status(404).send({status:false,msg:"blog does not exist"})
        
        }
        await blogModel.findOneAndUpdate({_id:id},{$set:{isDeleted:true,deletedAt:new Date()}})
        return res.status(200).send({status:true,msg:"blog deleted successfully"})
    }
    catch(err){
        res.status(500).send(err.message)
    }   
    
}

const updateBlog=async function (req,res) {
    try {
        const getId=req.params.blogId
        const blogData=req.body
        const blogCheck=await blogModel.findById(getId)                   //findbyid to verify blog exist or not
        if (blogCheck.isdeleted===false) {
            if(blogData.ispublished===true){
                blogData.publishedAt=new Date()
                console.log(blogData)
            }
            const updatedData=await blogModel.findOneAndUpdate({_id:getId},blogData,{new:true})
            return res.status(200).send({status:true,data:updatedData})
            }
        else{
            return res.status(401).send({status:false,msg:"blogs not found"})
           }

    } catch (error) {
            return res.status(500).send({status:false,error:error.message})
        }
    
}

const blogDeleteOptions=async function (req,res) {
    try {
        const data=req.query
        data.ispublished=false
        const blogs=await blogModel.updateMany(data,{isdeleted:true})
        if (blogs.matchedCount==0) {
            return res.status(404).send({status:false,data:'blogs not found'})
        }
        return res.status(200).send({status:true,msg:`${blogs.matchedCount} blogs deleted`})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports.createBlog = createBlog
module.exports.getBlog=getBlog;
module.exports.deleteBlog=deleteBlog;
module.exports.updateBlog=updateBlog;
module.exports.blogDeleteOptions=blogDeleteOptions;
