const BookModel = require("../models/bookModel")


const createBlog = async function (req, res) {
    try {
        let blog = req.body
        let authorId = blog.authorId
        if (!authorId) { return res.status(400).send({ msg: "authorId invalid" }) }
        let blogCreated = await blogModel.create(blog)
        res.status(201).send({ status: true, data: blogCreated })


    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
module.exports.createBlog = createBlog