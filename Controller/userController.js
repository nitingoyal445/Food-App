// const userDB = require("../Model/userModel.json");
const userModel = require("../Model/userModel");


function getAllUsers(req, res) {
    if (userDB.length) {
        res.status(200).json({
            message: "Successfully got all users",
            data: userDB
        })
    }
    else {
        res.status(200).json({
            message: "No User found"
        })
    }
}
function createUser(req, res) {
    let user = req.body;
    user.id = uuidv4();
    userDB.push(user);
    fs.writeFileSync("../Model/userModel.json", JSON.stringify(userDB));

    res.status(200).json({
        message: "User successfully added",
        data: userDB
    })

}
async function getUserById(req, res) {
try{
    let id = req.id;
    //get user
    let user = await userModel.findById(id);
    console.log(user);
    res.status(200).json({
        message: "Got user by id !!",
        data : user
    })
}
catch(error){
    res.json({
        message : "Failed to get user !!",
        error
    })
}

}
async function updateUserById(req, res) {
    try{
        let id = req.id;
        let updateObject = req.body.updateObj;
        let user = await userModel.findById(id);

        for(key in updateObject){
            user[key] = updateObject[key];
        }

        let updatedUser = await user.save();
        res.status(201).json({
            message: "Updated user",
            data : updatedUser
        })

    }
    catch(error){
        res.status(501).json({
            message : "Failed to update user",
            error
        })
    }
}
async function deleteUserById(req, res) {
    try{
        let id = req.id;
        let deletedUser = await userModel.findByIdAndDelete(id);
        if(deletedUser){
            res.status(200).json({
                message: "User deleted Successfully !!",
                data : deleteUser
            })
        }
        else{
            res.status(200).json({
                message:"User not found !!"
            })
        }
    }
    catch(error){
        res.status(501).json({
            message : "Failed to delete",
            error
        })
    }  
}

async function updateProfilePhoto(req, res){
    try{
        let file = req.file;
        console.log(file);
        let imagePath = file.destination+"/"+file.filename;
        imagePath = imagePath.substring(6);
        console.log(imagePath);
        //file.path // user ko mangao // uska change pImage
        //save();
        let id = req.id;
        let user = await userModel.findById(id);
        user.pImage = imagePath;
        await user.save({validateBeforeSave:false});
        res.json({
            message: "Profile Photo updated !!"
        })

    }
    catch(error){
        res.status(200).json({
            message:"failed to update photo !!",
            error
        })
    }
}


module.exports.getAllUsers = getAllUsers;
module.exports.createUser = createUser;
module.exports.getUserById = getUserById;
module.exports.updateUserById = updateUserById;
module.exports.deleteUserById = deleteUserById;
module.exports.updateProfilePhoto = updateProfilePhoto;