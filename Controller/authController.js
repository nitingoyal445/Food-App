const userModel = require("../Model/userModel");
const jwt = require("jsonwebtoken");
// const { SECRET_KEY, GMAIL_ID, GMAIL_PW } = require("../config/secrests");

const nodemailer = require("nodemailer");

const SECRET_KEY = process.env.SECRET_KEY;
const GMAIL_ID = prcess.env.GMAIL_ID;
const GMAIL_PW = process.env.GMAIL_PW;





async function sendEMail(message){
    try{
        // object => info
        const transporter = nodemailer.createTransport({ 
        service:"gmail",
        host: "smtp.gmail.com",
        secure: true,
        // port: 2525,
        auth: {
          user: GMAIL_ID,
          pass: GMAIL_PW
        }
     });

      let info = await transporter.sendMail({
        from: message.from, // sender address
        to: message.to, // list of receivers
        subject: message.subject, // Subject line
        text: message.text, // plain text body
        // html: "<b>Hello I am testing this stuff about sending mail</b>", // html body
      });
      return info;
    }   
    catch(error){
        return error;
    }
}





async function signup(req, res){
    try{
        let user = req.body;
        console.log(user);
        let newUser = await userModel.create({
            name:user.name,
            email:user.email,
            password:user.password,
            confirmPassword:user.confirmPassword,
            role:user.role,
        })
        console.log(newUser);
        res.status(201).json({
            message:"Successfully Signup !!",
            data : newUser
        });
    }
    catch(error){
        res.status(501).json({
            message: "Failed to signup",
            error

        })
    }
}

async function login(req, res){
    try{
        let {email, password} = req.body;
        console.log(email, password);
        let loggedInUser = await userModel.find({email:email});
        console.log(loggedInUser);
        if(loggedInUser.length){
            let user = loggedInUser[0];
            if(user.password == password){
                //token ban na chaiye
                const token = jwt.sign( {id : user["_id"]}, SECRET_KEY)
                res.cookie('jwt', token,{httpOnly:true});
                
                res.status(200).json({
                    message: "Logged in successfully !!",
                    data: loggedInUser[0],
                    // token
                });
                
            }
            else{
                res.status(200).json({
                    message : "Email and password didn't Matched !!"
                })
            }
        }
        else{
            res.status(200).json({
                message:"No User Found SingUp First"
            })
        }
    }
    catch(error){
        res.status(200).json({
            message:"Email and password didn't matched",
            error
        })
    }

}

async function logout(req, res){
    try{
        res.clearCookie("jwt");
        res.redirect("/");
    }
    catch(error){
        res.status(501).json({
            error
        })
    }
}

async function isLoggedIn(req, res, next){ 
    try{
        let token = req.cookies.jwt;
        const payload = jwt.verify(token, SECRET_KEY);
        if(payload){
            //logged in hai
            let user = await userModel.findById(payload.id);
            req.name = user.name;
            req.user = user;
            next();
        } 
        else{
            //logged in nhi hai
            next();
        }
    }
    catch(error){
        next();
        // res.status(200).json({
        //     err or
        // })
    }
}

async function protectRoute(req, res, next){
    try{
        // const {token} = req.body;
        // const token = req.headers.authorization.split(" ").pop();
        // console.log(token);
        const token = req.cookies.jwt;
        console.log("Insert protectRoute function");
        // console.log(token);
        const payload = jwt.verify(token, SECRET_KEY);
        console.log(payload);
        if(payload){
            req.id= payload.id; // id is stuffes into req.id
            next(); 
        }
        else{
            res.status(501).json({
                message: " PLease log in first "
            })

        }
    }
    catch(error){
        res.status(501).json({
            message: " PLease log in first !!",
            error

    })       
}
}

async function isAuthorized(req, res, next){
try{
    let id = req.id;
    console.log(id);
    let user = await userModel.findById(id);
    console.log(user.role);
    if(user.role=="admin"){
        next();
    }
    else{
        res.status(200).json({
            message:"You don't have admin rights !!"
        })
    }
}
catch(error){
    res.status(501).json({
        message:"Failed to Authorized !!",
        error
    })

}
}

async function forgetPassword(req, res){

    try{
        // email nikal do
        let {email} = req.body;
        console.log(email);
        //check that user present in db or not
        let user = await userModel.findOne({email:email});
        console.log(user);
        if(user){
            //pwToken
            //timeset
            let token = user.createPwToken();
            console.log(token);
            await user.save({validateBeforeSave:false});
            let resetLink = `http://localhost:3000/resetpassword/${token}`;
            let message = {
                from: "nitin.goyal_cs15@gla.ac.in",
                to: email,
                subject:"Reset Password",
                text:resetLink
            }
            let response = await sendEMail(message);
            res.json({
                message: "Reset link is sent to email",
                response
            })
        }
        else{
            res.status(404).json({
                message: "User Not Found !! Please Sign up first !"
            })
        }
    }
    catch(error){
        res.status(501).json({
            message: "User not found ! Please Sign up first",
            error
        })
    }

}

async function resetPassword(req,res){
    try{
        const token = req.params.token;
        const {password, confirmPassword} = req.body;
        const user = await userModel.findOne({
            pwToken: token,
            tokenTime:{ $gt : Date.now() }
        })
        console.log(user);
        console.log(password, confirmPassword);
        
        if(user){
            user.resetPasswordHandler(password, confirmPassword);
            await user.save();
            res.status(200).json({
                message: "Password Reset Successfully !!"
            })
        }
        else{
            res.status(200).json({
                message: "Password Reset Link Expired !!"
            })
        }
    }
    catch(error){
        res.status(404).json({
            message:  "Failed to reset password",
            error
        })
    }
}


module.exports.signup = signup;
module.exports.login = login;
module.exports.logout = logout;
module.exports.protectRoute = protectRoute;
module.exports.isAuthorized = isAuthorized;
module.exports.forgetPassword = forgetPassword;
module.exports.resetPassword = resetPassword;
module.exports.isLoggedIn = isLoggedIn;