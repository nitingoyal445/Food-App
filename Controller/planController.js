// const plans = require("../Model/plansModel.json");
// const {v4 : uuidv4} = require("uuid");
// const fs= require("fs");
// const path = require("path");
const planModel = require("../Model/plansModel");


async function createPlan(req, res){

    try{
        let sentPlan = req.body;
        let plan = await planModel.create(sentPlan);
        res.status(200).json({
            message: "Succesfully create a plan !",
            data: plan
            })
    }
    catch(error){
        res.status(501).json({
            message: "Failed to create a plan !",
            error: error.errors.discount.message
        })
    }
}
async function getAllPlans(req, res){
    try{
        let plans = await planModel.find({});
        res.status(200).json({
            message: "Got all plans successfully !",
            data : plans
        })
    }
    catch(error){
        res.status(501).json({
            lansmessage: "Failed to get all plans !",
            error: error
        })
    }
}
async function getPlanById(req, res){
    try{
        let {id} = req.params;
        let plan = await planModel.findById(id);
        res.status(200).json({
            message: "Successfully get plan by id !",
            data : plan
        })
    }
    catch(error){
        res.status(400).json({
            message: "Plan not found",
            error: error
        })
    }
    
}
async function updatePlanById(req, res){
    try{
        let id = req.params.id;
        let {updateObj} = req.body;
        // console.log(updateObj);
        // let updatedPlan = await planModel.findByIdAndUpdate(id, updateObj, {new:true});
        let plan = await planModel.findById(id);
        console.log(plan);
        for(key in updateObj){
            plan[key] = updateObj[key];
        }

        //create//save
        let updatedPlan = await plan.save();

        res.status(200).json({
            message: "Updated Successfully",
            data: updatedPlan
        })
    }
    catch(error){
        res.status(501).json({
            message: "failed to update plan",
            error: error.errors
        })
    }
    

}
async function deletePlanById(req, res){
    try{
        let {id} = req.params;
        let del = await planModel.findByIdAndDelete(id);
        res.status(200).json({
            message: "Successfully deleted",
            data: del
        })
    }
    catch(error){
        res.status(501).json({
            message:"ID not found",
            error
        })
    }
}

module.exports.getAllPlans = getAllPlans;
module.exports.createPlan = createPlan;
module.exports.getPlanById = getPlanById;
module.exports.updatePlanById = updatePlanById;
module.exports.deletePlanById = deletePlanById;