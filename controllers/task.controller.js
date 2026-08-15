const taskRepository = require("../repositories/task.repository");

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
// let tasks=[
//     {
//         id:0,
//         title:"task1",
//         done:false
//     },
//     {
//         id:1,
//         title:"task2",
//         done:true
//     },
//     {
//         id:2,
//         title:"task3",
//         done:true
//     }
// ];

// function getAllTasks(req,res){
//     return res.status(200).json({
//         message:"All Tasks",
//         taskList:tasks
//     })
// }
async function getAllTasks(req, res) {
    try {
        const tasks = await taskRepository.findAll();

        return res.status(200).json({
            message: "All Tasks",
            taskList: tasks
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
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
async function getTaskById(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid task id"
            });
        }

        const task = await taskRepository.findById(id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        return res.status(200).json({
            task
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}
// function createTask(req,res){
//     const {title}=req.body;
//     if(!title){
//         return res.status(400).json({
//             message:"Kindly provide the title for the task"
//         })
//     }
//     const task={
//         id:tasks.length,
//         title:title,
//         done:false
//     }
//     tasks.push(task);
//     return res.status(201).json({
//         message:"Task Created successfully",
//         task:task
//     })

// }
async function createTask(req, res) {
    try {
        const { title } = req.body;

        if (
            typeof title !== "string" ||
            title.trim() === ""
        ) {
            return res.status(400).json({
                message: "Kindly provide the title for the task"
            });
        }

        const task = await taskRepository.create(
            title.trim(),
            false
        );

        return res.status(201).json({
            message: "Task Created successfully",
            task
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

// function updateTask(req,res){
//     const id=Number(req.params.id);
//     const {title,done}=req.body;
//     if(title===undefined&&done===undefined){
//         return res.status(400).json({
//             message:"kindly fill one field"
//         })
//     }
//     for(let i=0;i<tasks.length;i++){
//         if(id===tasks[i].id){
//             tasks[i]={
//                 id:id,
//                 title:title!==undefined?title:tasks[i].title,
//                 done:done!==undefined?done:tasks[i].done
//             }
//             return res.status(200).json({
//                 message:"task updated successfully",
//                 task:tasks[i]
//             })
//         }
//     }
//     return res.status(404).json({
//         message:"Task not found invalid id"
//     })
// }
async function updateTask(req, res) {
    try {
        const id = Number(req.params.id);
        const { title, done } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid task id"
            });
        }

        if (title === undefined && done === undefined) {
            return res.status(400).json({
                message: "kindly fill one field"
            });
        }

        if (
            title !== undefined &&
            (
                typeof title !== "string" ||
                title.trim() === ""
            )
        ) {
            return res.status(400).json({
                message: "Invalid title"
            });
        }

        if (
            done !== undefined &&
            typeof done !== "boolean"
        ) {
            return res.status(400).json({
                message: "done must be boolean"
            });
        }

        const existingTask =
            await taskRepository.findById(id);

        if (!existingTask) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        const updatedTitle =
            title !== undefined
                ? title.trim()
                : existingTask.title;

        const updatedDone =
            done !== undefined
                ? done
                : existingTask.done;

        const updatedTask =
            await taskRepository.update(
                id,
                updatedTitle,
                updatedDone
            );

        return res.status(200).json({
            message: "task updated successfully",
            task: updatedTask
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}
// function deleteTask(req,res){
//     const id=Number(req.params.id);
//     let length=tasks.length;
//     tasks=tasks.filter(task=> task.id!==id);
//     if(length===tasks.length){
//         return res.status(404).json({
//             message:"id Not found"
//         })
//     }
//     return res.status(204).send();
// }
async function deleteTask(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid task id"
            });
        }

        const deletedCount =
            await taskRepository.deleteById(id);

        if (deletedCount === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        return res.status(204).send();

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}
module.exports={getAllTasks,getTaskById,createTask,updateTask,deleteTask}