const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")

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
module.exports.createBlog = createBlog