let tasks=[
    {
        id:1,
        title:"task1",
        done:false
    },
    {
        id:2,
        title:"task2",
        done:true
    },
    {
        id:3,
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

module.exports={getAllTasks,getTaskById}