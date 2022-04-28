const express = require('express');
const authorController= require("../controllers/authorController")
const blogController = require("../controllers/blogController")

const router = express.Router();

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


 router.post("/Authors",authorController.createAuthors)

 router.post("/Blogs",blogController.createBlog)

 router.get('/blogs',blogController.getBlog );

 router.delete('/blogs/:blogId',blogController.deleteBlog );

 router.put('/blogs/:blogId',blogController.updateBlog)
 router.delete('/blogs',blogController.blogDeleteOptions)




module.exports = router;