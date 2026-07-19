const express=require('express')
const router=express.Router()

router.get('/',(req,res)=>{
    return res.status(200).json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]
        })
})

router.get('/health',(req,res)=>{
    return res.status(200).json({ "status": "ok" });
})

module.exports=router