const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const mongoose = require('mongoose');
const validator = require("../utils/validator");

const ObjectId= mongoose.Types.ObjectId

const createBlog = async function (req, res) {
    try {
        let blog = req.body
        
        if (!validator.isValidRequestBody(blog)) {
            return res.status(400).send({
              status: false,
              message: "Invalid request parameter, please provide author Detaills",
            });
        }
      
        const { title, body, authorId, category } = blog;
      
        if (!validator.isValid(title)) {
            return res
              .status(400)
              .send({ status: false, message: "title is required" });
        }
        if (!validator.isValid(body)) {
            return res
              .status(400)
              .send({ status: false, message: "body is required" });
        }
        if (!validator.isValid(authorId)) {
            return res
              .status(400)
              .send({ status: false, message: "authorId is required" });
        }
        if (!validator.isValid(category)) {
            return res
              .status(400)
              .send({ status: false, message: "category is required" });
        }
        let isValidId=ObjectId.isValid(authorId)
        if(!isValidId){
            return res.status(400).send({status:false,msg:"authorId is not valid"})
        }
          
        let auth = await authorModel.findById(authorId)
        if (!auth) { return res.status(400).send({ msg: "authorId does not exist" }) }

        let blogCreated = await blogModel.create(blog)
        return res.status(201).send({ status: true, data: blogCreated })


    }
    catch (err) {
        
       return res.status(500).send({ msg: "Error", error: err.message })
    }
}



const getBlog=async function(req,res){
    try{
        let filteredData={isDeleted:false,isPublished:true}
        let data=req.query

        const {authorId,tags,category,subCategory}=data;

        if(validator.isValid(authorId)){
            const valid=ObjectId.isValid(authorId)
            if(!valid){
                return res.send({status:false,msg:"authorid is not valid"})
            }
            else
            {
                filteredData["authorId"]=authorId
            }
        }
        if(validator.isValid(category)){
        
            filteredData["category"]=category.trim()
        }

        if(validator.isValid(subCategory)){
            const subArray=subCategory.trim().split(",").map(val=>val.trim())
            filteredData["subCategory"]={$all:subArray}
        }

        if(validator.isValid(tags)){
            const tagArray=tags.trim().split(",").map(val=>val.trim())
            filteredData["tags"]={$all:tagArray}
        }
        
        let BlogDetails=await blogModel.find(filteredData)
        if(BlogDetails.length===0)
        {
            return res.status(404).send({status:false,msg:"blogs are not present"})
        }
        else{
           return res.status(200).send({status:true,data:BlogDetails})
        }
    }
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }

}

const deleteBlog=async function(req,res){
    try{
        let blogId=req.params.blogId
        let idFromToken=req.authorId
       
    
        let isValidId=ObjectId.isValid(blogId)
        if(!isValidId){
            return res.status(400).send({status:false,msg:"blogid is not valid"})
        }

       let blog=await blogModel.findOne({_id:blogId,isDeleted:false})
        if(!blog)
        {
            return res.status(404).send({status:false,msg:"blog does not exist"})
        
        }
        if(idFromToken!=blog.authorId){
            return res.status(401).send({status:false,msg:"Unathorized access"})
        }

        await blogModel.findOneAndUpdate({_id:blogId},{$set:{isDeleted:true,deletedAt:new Date()}})
        return res.status(200).send({status:true,msg:"blog deleted successfully"})
    }
    catch(err){
        return res.status(500).send({status:false,error:err.message})
    }   
    
}

const updateBlog=async function (req,res) {
    try {
        const blogId=req.params.blogId
        const blogData=req.body
        let idFromToken=req.authorId

        const {title,category,body,tags,subCategory,isPublished}=blogData

        let isValidId=ObjectId.isValid(blogId)

        if(!isValidId){
            return res.status(400).send({status:false,msg:"blogid is not valid"})
        }
        const checkId=await blogModel.findOne({_id:blogId,isDeleted:false})
        //const checkId=await blogModel.findById(getId)
        
        if (!checkId) {
            return res.status(400).send({status:false,msg:'blog not found'})
        }

        if(idFromToken != checkId.authorId){
            return res.status(401).send({status:false,msg:"Unathorized access"})
        }

        if(validator.isValid(isPublished)){
            if (isPublished===true && checkId.isPublished===false) {
                await blogModel.findOneAndUpdate({_id:blogId},{$set:{isPublished:true,publishedAt:Date.now()}})
            }
        }

        if (validator.isValid(title)){
            await blogModel.findOneAndUpdate({_id:blogId},{$set:{title:title}})
        }
        
        if (validator.isValid(category)) {
            await blogModel.findOneAndUpdate({_id:blogId},{$set:{category:category}})
        }
        if (validator.isValid(body)) {
            await blogModel.findOneAndUpdate({_id:blogId},{$set:{body:body}})
        }
        if(validator.isValid(tags)) {
            await blogModel.findOneAndUpdate({_id:blogId},{$addToSet:{tags:tags}})
        }
        if (validator.isValid(subCategory)) {
            await blogModel.findOneAndUpdate({_id:blogId},{$addToSet:{subCategory:subCategory}})
        }

        if(!(isPublished || title || category || body  || tags || subCategory ))
        {
            return res.status(400).send({status:false,msg:"Parameters required to update blog"})
        }

        const updatedData= await blogModel.findById(blogId)
        return res.status(200).send({status:true,msg:"blog updated successfully",data:updatedData})
        
        
    } catch (error) {
        return res.status(500).send({status:false,error:error.message})
    }
    
}

const blogDeleteOptions=async function (req,res) {
    try{
        const data=req.query
        const idFromToken=req.authorId
        const {category,authorId,tags,subCategory,isPublished}=data

        let filter={isDeleted:false}

        if(validator.isValid(category)){
            filter['category']=category.trim()
        }

        if(validator.isValid(authorId)){
            let isValidId=ObjectId.isValid(authorId)
            if(!isValidId){
                return res.status(400).send({status:false,msg:"authorid is not valid"})
            }
            filter['authorId']=authorId
        }

        if(validator.isValid(tags)){
            const tagArray=tags.trim().split(",").map(val=>val.trim())
            filter['tags']={$all:tagArray}
        }

        if(validator.isValid(subCategory)){
            const subArray=subCategory.trim().split(",").map(val=>val.trim())
            filter["subCategory"]={$all:subArray}
        }

        if(validator.isValid(isPublished)){
            filter['isPublished']=isPublished
        }

        if(!(category || authorId || tags || subCategory || isPublished))
        {
            return res.status(400).send({status:false,msg:"Parameters required to delete blogs"})
        }

        let blogs=await blogModel.find(filter)
        // console.log(blogs)
        if(blogs.length===0)
        {
            return res.status(404).send({status:false,msg:"blogs not found"})
        }
    
        let blogsToDelete=blogs.map(value=>{
        if(value.authorId==idFromToken)  return value._id
        })

        let deletedBlogs=await blogModel.updateMany({_id:{$in:blogsToDelete}},{$set:{isDeleted:true,deletedAt:new Date()}})
        if(deletedBlogs.matchedCount==0)
        {
            res.send({msg:"No blogs to delete"})
        }
        return res.status(200).send({status:true,msg:"blogs deleted successfully"})
    }
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }

}


module.exports.createBlog = createBlog
module.exports.getBlog=getBlog;
module.exports.deleteBlog=deleteBlog;
module.exports.updateBlog=updateBlog;
module.exports.blogDeleteOptions=blogDeleteOptions;
