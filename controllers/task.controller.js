let tasks=[
    {
        id:0,
        title:"task1",
        done:false
    },
    {
        id:1,
        title:"task2",
        done:true
    },
    {
        id:2,
        title:"task3",
        done:true
    }
];

function getAllTasks(req,res){
    return res.status(200).json({
        message:"All Tasks",
        taskList:tasks
    })
}
function getTaskById(req,res){
    const id=Number(req.params.id);
    for(let i=0;i<tasks.length;i++){
        if(tasks[i].id===id){
            return res.status(200).json({
                task:tasks[i]
            })
        }
    }
    return res.status(404).json({
        error:`Task ${id} not found`
    })
}

function createTask(req,res){
    const {title}=req.body;
    if(!title){
        return res.status(400).json({
            message:"Kindly provide the title for the task"
        })
    }
    const task=tasks.push({
        id:tasks.length,
        title:title,
        done:false
    })
    return res.status(201).json({
        message:"Task Created successfully",
        task:task
    })

}

module.exports={getAllTasks,getTaskById,createTask}