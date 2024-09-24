// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./pulic/temp");
//     },
//     filename: function (req, file, cb) {
        
//         cb(null, file.originalname);
//     }
// })

// export const upload = multer({ storage, })
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})