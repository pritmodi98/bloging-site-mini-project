const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController')
const blogController = require('../controllers/blogController')
const middleware = require('../middleware/middleware')


router.post('/authors', authorController.createAuthor);

router.post('/login', authorController.loginAuthor);

router.post('/blogs', blogController.createBlog);

router.get('/filterblogs', blogController.getBlog);

 router.put('/blogs/:blogId', blogController.deleteBlog);

 router.post("/Blogs",blogController.createBlog)

 router.get('/blogs',blogController.getBlog );

 router.delete('/blogs/:blogId',blogController.deleteBlog );

 router.put('/blogs/:blogId',blogController.updateBlog)
 router.delete('/blogs',blogController.blogDeleteOptions)




