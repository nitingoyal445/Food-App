const mongoose = require("mongoose");
// const { DB_LINK } = require("../config/secrests");

const DB_LINK = process.env.DB_LINK;

mongoose
.connect(DB_LINK,
{useNewUrlParser: true, useUnifiedTopology:true}
)
.then((db)=>{
    console.log(db);
});

let planSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        maxlength:[40, "Your Plan Name is more than 40 characters !!"]
    },
    duration:{
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating : Number,
    discount: {
        type:Number,
        validate: {
            validator: function(){
                return this.discount < this.price;
            },
            message: "Discount must be less than actual price"
        }
    }
})


const planModel = mongoose.model("planscollection", planSchema);

module.exports = planModel;