const express=require('express')
const router=express.Router()
const {getAllTasks,getTaskById}=require('../controllers/task.controller')
router.get('/',(req,res)=>{
    return res.status(200).json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]
        })
})

router.get('/tasks',getAllTasks)
router.get('/tasks/:id',getTaskById)
router.get('/health',(req,res)=>{
    return res.status(200).json({ "status": "ok" });
})

module.exports=router