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
              client_reference_id: planId,
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
  try{

    const END_POINT_KEY = process.env.END_POINT_KEY;
  
    // console.log("Checkout Complete ran !!");
    // console.log("Request object");
    // console.log(req);
    const stripeSignature = req.headers['stripe-signature'];
    
    // let event;
    // try {
    //   event = stripeObj.webhooks.constructEvent(req.body, stripeSignature, END_POINT_KEY);
    // }
    // catch (err) {
    //   res.status(400).send(`Webhook Error: ${err.message}`);
    // }

    // console.log("event object !!");
    // console.log(event);
    // if(event.type == "checkout.session.completed"){
    //   console.log(event);
    // }
    // else{

    // }
    // if(req.body.data.type == "checkout.session.completed"){
      const userEmail = req.body.data.object.customer_email;
      const planId = req.body.data.object.client_reference_id;
      await createNewBooking(userEmail, planId);
    // }
  }
  catch(error){
    res.json({
      error
    })
  }
  
}


async function createNewBooking(userEmail, planId){
  
    //booking collection => 
  //if (user.bookedPlanId){
      //  get booking id => go to booking document, push in bookedPlans
  //}
  //else{
    // new booking document
    //id => user.bookedPlanId
    //booking document.bookedPlans.push(obj); 
  //}
  try{
    const user = await userModel.findOne({email: userEmail});
    const plan = await planModel.findById(planId);

    const userId = user["_id"];

    if(user.bookedPlanId== undefined){
      const bookingOrder = {
        userId: userId,
        bookedPlans : [{planId: planId, name:plan.name, currentPrice : plan.price }]
      }
      const newBookingOrder = await bookingModel.create(bookingOrder);
      user.bookedPlanId = newBookingOrder["_id"];
      await user.save({validateBeforeSave: false});
    }
    else{
      //already bough some plan
      const newBookedPlan = {
        planId : planId,
        name : plan.name,
        currentPrice: plan.price
      }
      const userBookingObject = await bookingModel.findById(user.bookedPlanId);
      userBookingObject.bookedPlans.push(newBookedPlan);
      await userBookingObject.save();
    }
  }
  catch(error){
    return error;
  }
  

}

module.exports.createPaymentSession = createPaymentSession;
module.exports.checkoutComplete = checkoutComplete;