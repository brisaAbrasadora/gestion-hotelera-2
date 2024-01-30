const multer = require("multer");

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(req.url.endsWith("incidencias")) {
            cb(null, "public/uploads/incidencias")
        } else {
            cb(null, "public/uploads")
        }
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname) // null, file.originalname
        
    }
});

let upload = multer({storage: storage});

module.exports = {
    file: upload
};