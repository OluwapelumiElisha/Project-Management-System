const multer = require('multer')

const storage = multer.diskStorage({
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
})

const multerUploads = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

module.exports = multerUploads