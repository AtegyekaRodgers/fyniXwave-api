//import dependencies
const express=require('express');
const mongoose=require('mongoose')

const router = express.Router();

const upload = require('../uploads/multer')
const cloudinary = require('../cloudinary')
const path = require('path')

//file system
const fs = require('fs')

//require models

//post request for content
router.post('/upload-content', upload.array('image'), async(req,res)=>{
    //get the upload path
    const uploader = async(path) => await cloudinary.uploads(path,'images')

    //check if it is a post request
    if (req.method === 'POST')
    {

        //array of urls
        const urls = []

        //get all files that are passed as attached
        const files =req.files


        for (const file of files) {
            const {path} = file
            const newPath = await uploader(path)
            
            //store the url
            urls.push(newPath)
            //delete the file from the server once uploaded
            fs.unlinkSync(path)
        }

        //message to the use if successful
        res.status(200).json({
            message: "content uploaded successfully",  
            data:urls
        })
          //message to the use if not successful
    }else{
        res.status(405).json({
            error: "Content not uploaded successfully"
        })
    }
})