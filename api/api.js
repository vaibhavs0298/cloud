require("dotenv").config();
var express = require("express");
var router = express.Router();
var aws = require("aws-sdk");
var fs = require("fs");
const multer = require('multer');


aws.config.update({

    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

});

var s3 = new aws.S3({ apiVersion: "2006-03-01" });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const file = multer({ storage: storage });


router.post("/upload", file.single("filename"), function (req, res) {
    try {
            fs.readFile(req.file.filename, function (err, data) {//Read file
                if (err) {
                    res.json({ message: "Something went wrong" })
                } else {
                    var params = { Bucket: 'demoupload2', Key: req.file.filename, Body: data };
                    console.log("params", params)
                    s3.upload(params, function (err, data) {//Upload File
                        if (err) {
                            console.log("err", err)
                            res.json({ message: "Something went wrong" })
                        } else {
                            console.log("data", data)
                            res.json({ message: "Upload the data" })
                        }
                    });
                }
            })
    } catch (e) {
        console.log("err1", e)
        res.json({ message: "Something went wrong" })


    }

})


router.get("/get/:filename", function (req, res) {//filename send in url
    try {
        var params = {
            Bucket: "demoupload2",//bucket name
            Key: req.params.filename//filename 
        };
        s3.getObject(params, function (err, data) {//get data from S3
            if (err) {
                console.log("err", err)
                if ("NOSuchKey") { //If not exist in S3
                    res.json({ message: "No such file exist" })
                } else {
                    res.json({ message: "Something went wrong" })
                }
            }
            else {
                console.log("data", data)
                // res.download(data)
                res.json({ message: "Get data", data: data })// Get file from S3
            }
        })
    } catch (e) {
        console.log("err2", e)
        res.json({ message: "Something went wrong" })

    }

})



module.exports = router;
