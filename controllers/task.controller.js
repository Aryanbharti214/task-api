const db = require("../db");

function formatTask(row) {
    if (!row) {
        return null;
    }

    return {
        id: row.id,
        title: row.title,
        done: Boolean(row.done)
    };
}
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

// function getAllTasks(req,res){
//     return res.status(200).json({
//         message:"All Tasks",
//         taskList:tasks
//     })
// }
function getAllTasks(req, res) {
    const rows = db
        .prepare("SELECT * FROM tasks")
        .all();

    const tasks = rows.map(formatTask);

    return res.status(200).json({
        message: "All Tasks",
        taskList: tasks
    });
}
// function getTaskById(req,res){
//     const id=Number(req.params.id);
//     for(let i=0;i<tasks.length;i++){
//         if(tasks[i].id===id){
//             return res.status(200).json({
//                 task:tasks[i]
//             })
//         }
//     }
//     return res.status(404).json({
//         error:`Task ${id} not found`
//     })
// }
function getTaskById(req, res) {
    const id = Number(req.params.id);

    const row = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);

    if (!row) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    return res.status(200).json({
        task: formatTask(row)
    });
}
function createTask(req,res){
    const {title}=req.body;
    if(!title){
        return res.status(400).json({
            message:"Kindly provide the title for the task"
        })
    }
    const task={
        id:tasks.length,
        title:title,
        done:false
    }
    tasks.push(task);
    return res.status(201).json({
        message:"Task Created successfully",
        task:task
    })

}

function updateTask(req,res){
    const id=Number(req.params.id);
    const {title,done}=req.body;
    if(title===undefined&&done===undefined){
        return res.status(400).json({
            message:"kindly fill one field"
        })
    }
    for(let i=0;i<tasks.length;i++){
        if(id===tasks[i].id){
            tasks[i]={
                id:id,
                title:title!==undefined?title:tasks[i].title,
                done:done!==undefined?done:tasks[i].done
            }
            return res.status(200).json({
                message:"task updated successfully",
                task:tasks[i]
            })
        }
    }
    return res.status(404).json({
        message:"Task not found invalid id"
    })
}

function deleteTask(req,res){
    const id=Number(req.params.id);
    let length=tasks.length;
    tasks=tasks.filter(task=> task.id!==id);
    if(length===tasks.length){
        return res.status(404).json({
            message:"id Not found"
        })
    }
    return res.status(204).send();
}
module.exports={getAllTasks,getTaskById,createTask,updateTask,deleteTask}