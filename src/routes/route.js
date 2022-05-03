const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController')
const blogController = require('../controllers/blogController')
const middleware = require('../middleware/middleware')


router.post('/authors', authorController.createAuthor);
router.post('/login', authorController.loginAuthor);
router.post('/blogs',middleware.authentication,middleware.authorization, blogController.createBlog);
router.get('/filterblogs', middleware.authentication, blogController.getBlog);
router.put('/blogs/:blogId',middleware.authentication,middleware.authorization, blogController.updateBlog)
router.delete('/blogs/:blogId',middleware.authentication,middleware.deleteBlog,  blogController.deleteBlog );
router.delete('/blogs',middleware.authentication,middleware.deleteBlog, blogController.blogDeleteOptions)


module.exports=router;

