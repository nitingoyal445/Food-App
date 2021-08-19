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
              success_url: 'https://foodplan-app.herokuapp.com/',
              cancel_url: 'https://foodplan-app.herokuapp.com/',
        
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

    const END_POINT_KEY = process.env.END_POINT_KEY;
  
    // console.log("Checkout Complete ran !!");
    // console.log("Request object");
    // console.log(req);
    const stripeSignature = req.headers['stripe-signature'];
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, stripeSignature, END_POINT_KEY);
    }
    catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
    }

    Console.log("event object !!");
    console.log(event);
    // if(event.type == "checkout.session.completed"){
    //   console.log(event);
    // }
    // else{

    // }

  
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