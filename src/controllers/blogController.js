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
        let isValidId=ObjectId.isValid(blogId)
        if(!isValidId){
            return res.status(400).send({status:false,msg:"blogid is not valid"})
        }
        const checkId=await blogModel.findById(getId)
        // const blogObject={}                                  //id exists or not
        if (!checkId) {
            return res.status(400).send({status:false,msg:'blog does not exist'})
        }
        if (checkId.isDeleted===false) {
            if (blogData.isPublished===true && checkId.isPublished===false) {
               await blogModel.findOneAndUpdate({_id:getId},{$set:{isPublished:true,publishedAt:Date.now()}})
                // console.log(blogData)
            }
            if (blogData.title) {
                await blogModel.findOneAndUpdate({_id:getId},{$set:{title:blogData.title}})
            }
            if (blogData.category) {
                await blogModel.findOneAndUpdate({_id:getId},{$set:{category:blogData.category}})
            }
            if (blogData.body) {
                await blogModel.findOneAndUpdate({_id:getId},{$set:{body:blogData.body}})
            }
            if (blogData.tags) {
                await blogModel.findOneAndUpdate({_id:getId},{$addToSet:{tags:blogData.tags}})
            }
            if (blogData.subCategory) {
                await blogModel.findOneAndUpdate({_id:getId},{$addToSet:{subCategory:blogData.subCategory}})
            }
            const updatedData= await blogModel.findById(getId)
            return res.status(200).send({status:true,data:updatedData})
        }
        else{
            return res.status(404).send({status:false,msg:"blogs not found"})
        }
    } catch (error) {
        return res.status(500).send({status:false,error:error.message})
    }
    
}

const blogDeleteOptions=async function (req,res) {
    const {...data}=req.query
    
    if (data.catagory) {
        const updatedData=await blogModel.findOneAndUpdate({catagory:data.catagory},{isDeleted:true,deletedAt:Date.now()},{new:true})
        if (!updatedData) {
            return res.status(404).send({status:false,msg:`this ${data.category} does not exist`})
        }
        return res.status(200).send({status:true,data:updatedData})
    }
    if (data.authorId) {
        const updatedData=await blogModel.findOneAndUpdate({authorId:data.authorId},{isDeleted:true,deletedAt:Date.now()},{new:true})
        if (!updatedData) {
            return res.status(404).send({status:false,msg:`this ${data.authorId} does not exist`})
        }
        return res.status(200).send({status:true,data:updatedData})
    }
    if (data.tags) {
        const updatedData=await blogModel.findOneAndUpdate({tags:data.tags},{isDeleted:true,deletedAt:Date.now()},{new:true})
        if (!updatedData) {
            return res.status(404).send({status:false,msg:`this ${data.tags} does not exist`})
        }
        return res.status(200).send({status:true,data:updatedData})
    }
    if (data.subCategory) {
        const updatedData=await blogModel.findOneAndUpdate({subCategory:data.subCategory},{isDeleted:true,deletedAt:Date.now()},{new:true})
        if (!updatedData) {
            return res.status(404).send({status:false,msg:`this ${data.subCategory} does not exist`})
        }
        return res.status(200).send({status:true,data:updatedData})
    }
    if (data.isPublished===false) {
        const updatedData=await blogModel.findOneAndUpdate({isPublished:false},{isDeleted:true,deletedAt:Date.now()},{new:true})
    }
    else{
        return res.status(404).send({status:false,msg:"Unpublished Data does not exist anymore"})
    }
    
}

module.exports.createBlog = createBlog
module.exports.getBlog=getBlog;
module.exports.deleteBlog=deleteBlog;
module.exports.updateBlog=updateBlog;
module.exports.blogDeleteOptions=blogDeleteOptions;
