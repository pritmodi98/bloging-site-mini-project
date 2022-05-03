const express = require('express');
const { default: mongoose } = require('mongoose');
const bodyparser = require("body-parser")
const router = require('./routes/route');
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Prit:1XW7ojhyQOrwisLq@pritcluster.dgvbr.mongodb.net/prit-db5", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )
// app.use(globalMw)
// function globalMw(req,res,next) {
//     // const ip=req.ip
//     const route=req.originalUrl
//     // const date =new Date().toLocaleString()
//     console.log(route)
//     next()
// }

app.use('/', router);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});

