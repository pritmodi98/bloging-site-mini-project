const { application } = require('express');
 const express = require('express');

const router = express.Router();


const authorController= require("../controllers/authorController")
const blogController = require("../controllers/blogController")
// const publisherController = require('../controllers/publisherController');

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

//router.post("/createPublisher",publisherController.createPublisher)

 router.post("/Authors",authorController.createAuthors)

 router.post("/Blogs",blogController.createBlog)

// app.post('/user/All',function (req,res){
//     authorController.createAuthors});


// router.post("/createBook",bookController.createBook)

// router.get("/getpublisherauthordetails",bookController.getPublisherAuthorDetails)
// router.put("/updatebooks",bookController.updateBooks)
// router.put("/updatebookprice",bookController.updateBookPrice)

module.exports = router;