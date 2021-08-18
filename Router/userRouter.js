const express = require("express");
const userRouter = express.Router();
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null , 'public/images/users');
    },
    filename : function(req, file, cb){
        cb(null, `user${Date.now()}.jpg`);
    }
})

function fileFilter(req, file , cb){
    if(file.mimetype.includes("image")){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

const upload = multer({storage:storage, fileFilter:fileFilter});

const {  getUserById, updateUserById, deleteUserById, updateProfilePhoto } = require("../Controller/userController");



const{ signup, login, protectRoute, forgetPassword, resetPassword } = require("../Controller/authController");


userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/forgetPassword", forgetPassword);
userRouter.patch("/resetPassword/:token", resetPassword);

userRouter.use(protectRoute);

userRouter.patch("/updateprofilephoto", upload.single("user"), updateProfilePhoto);

userRouter
.route("")
.get(getUserById)
.patch(updateUserById)
.delete(deleteUserById);



// userRouter
// .route("")
// .get(getAllUsers);
// .post(createUser); // signup se ho jaega



module.exports = userRouter;