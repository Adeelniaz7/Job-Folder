const Job = require('../models/Job')

const createJob = async (req,res) => {
    const {title,description,company,location,salary,jobType} = req.body
    try {
        const job = await Job.create({
            title,
            description,
            company,
            location,
            salary,
            jobType,
            postedBy:req.user.id
        })
        return res.status(200).json({job})
    } catch(error){
        return res.status(500).json({message:error.message})
    }
}
const getAllJobs = async (req,res) => {
    try{
        const jobs = await Job.find()
        return res.status(200).json({jobs})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
const getJobById = async (req,res) => {
    try{
        const job = await Job.findById(req.params.id) 
    if(!job) {
        return res.status(404).json({message:'Job not found'})
    }
    return res.status(200).json({job})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
const getdeleteJobById = async (req,res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id)
        if(!job){
        return res.status(404).json({message:'job not found'})
        }
        return res.status(201).json({job})
    } catch (error){
        return res.status(500).json({message:error.message})
    }
}
const getUpdateJobById = async (req,res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:false})
        if(!job){
            return res.status(404).json({message:'job not found'})
        }
        return res.status(200).json({job})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
module.exports = {createJob,getAllJobs,getJobById,getdeleteJobById,getUpdateJobById}