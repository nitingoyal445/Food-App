const express = require("express");
const planRouter = require("./Router/planRouter");
const userRouter = require("./Router/userRouter");
const viewRouter = require("./Router/viewRouter");
const path = require("path");
const cookieParser = require("cookie-parser");
const bookingRouter = require("./Router/bookingRouter");

const app = express();
app.use(cookieParser());

//It trackes incoming request and see if there is datat in the request => the data will be fed in req.body
app.use(express.json());

app.use( express.static("public"));

// app.httpMethod( appRoute, cb function( request, response))

//view engine set
app.set("view engine" , "pug");
//view path set
app.set("views" , path.join(__dirname,"View"));

app.use("/api/booking", bookingRouter);
app.use("/api/plans", planRouter);
app.use("/api/user" , userRouter);
app.use("", viewRouter);





let port = process.env.PORT || 4000;
app.listen(port , function(){
    console.log("Server started at port 4000");
})