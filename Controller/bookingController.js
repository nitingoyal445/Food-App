const stripe = require("stripe");
const bookingModel = require("../Model/bookingModel");
const planModel = require("../Model/plansModel");
const userModel = require("../Model/userModel");
const stripeObj = stripe('sk_test_51JPWPbSCYehKLlkfemkPRk71ObEyYlpiha56cdm93f4zTaaF9LDpNhAFAVKDcwusFgg4p52gEpglnwsThtj7dHmp00uCsMOBT4');



async function createPaymentSession(req, res){
    try{
        const userId = req.id;
        const {planId} = req.body;
        const plan = await planModel.findById(planId);
        const user = await userModel.findById(userId);
        //session object
        const session = await stripeObj.checkout.sessions.create({
            payment_method_types: [
                'card',
              ],
            //   customer:user.name,
              customer_email:user.email,
              line_items: [
                {
                    price_data:{
                        currency: 'usd',
                        product_data:{
                            name:plan.name,
                        },
                        unit_amount: plan.price,
                    },
                  // TODO: replace this with the `price` of the product you want to sell
                //   price: plan.price,
                  quantity: 1,
                },
              ],
              mode: 'payment',
              success_url: 'http://localhost:3000/',
              cancel_url: 'http://localhost:3000/',
        
        });

        res.json({
            session
        })

    }
    catch(error){
        res.json({
            message:"Failed to create payment session",
            error
        })
    }
}


async function checkoutComplete(req, res){
  console.log("Checkout Complete ran !!");
}


async function createNewBooking(req,res){
  //booking collection => 
  //if (user.bookedPlanId){
      //  get booking id => go to booking document, push in bookedPlans
  //}
  //else{
    // new booking document
    //id => user.bookedPlanId
    //booking document.bookedPlans.push(obj); 
  //}
  


}

module.exports.createPaymentSession = createPaymentSession;
module.exports.checkoutComplete = checkoutComplete;