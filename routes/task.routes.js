const express=require('express')
const router=express.Router()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);
const {getAllTasks,getTaskById,createTask,updateTask,deleteTask}=require('../controllers/task.controller')
router.get('/',(req,res)=>{
    return res.status(200).json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]
        })
})

router.get('/tasks',getAllTasks);
router.get('/tasks/:id',getTaskById);
router.post('/tasks',createTask);
router.put('/tasks/:id',updateTask);
router.delete('/tasks/:id',deleteTask);
router.get('/health',(req,res)=>{
    return res.status(200).json({ "status": "ok" });
})

module.exports=router