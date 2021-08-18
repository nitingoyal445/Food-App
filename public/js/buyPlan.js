// const { default: Stripe } = require("stripe");

let buyPlansButtons = document.querySelectorAll(".signup-button a");
let allLis = document.querySelectorAll(".showcase-ul li");

const stripe = Stripe('pk_test_51JPWPbSCYehKLlkf0FbnXW1B0503AehI7QFdhD0727acFUXcQW7VOacATiAXKanRlppOEKTKl4bQwcAoQEab852m00Nsrkzuco');


for(let i=0; i<buyPlansButtons.length;i++){
    buyPlansButtons[i].addEventListener("click", async function(){
        try{
            if(allLis.length<6){
                window.location.href = "/login";
            }
            else{
                let planId = buyPlansButtons[i].getAttribute("planid");
                let session = await axios.post("http://localhost:3000/api/booking/createPaymentSession", {planId: planId});
                let sessId = session.data.session.id;
                console.log(sessId);
                let result = await stripe.redirectToCheckout({sessionId: sessId});
                console.log(result);
            }
        }
        catch(error){
            alert(error.message);
        }
    })
}

