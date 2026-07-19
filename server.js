const express=require('express');
const app=express();
const port=3000;

const taskRoutes=require('./routes/task.routes')
app.use(express.json())

app.use('/',taskRoutes);

// app.get('/',(req,res)=>{
//     res.status(200).send("Hello World")
// })

app.listen(port,()=>{
    console.log(`Server is Running on port ${port}`);
    
})