const multer = require('multer');

//specify the storage engine
const storage = multer.storage({
    destination: function (req,file,cb) {
        cb(null, './uploads/')
    },
    //creating arandom name attached to the file uploaded
    filename: function(req,file,cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

//file validation
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null,true)
    }
    else{
        //not mime type file
        cb({message:'unsupported file format'},false)
    }
}

//attach storage and filefilter
const upload = multer({
    storage:storage,
    limits:{ fileSize: 800000},
    fileFilter: fileFilter 
})
module.exports = upload