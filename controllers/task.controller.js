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
function createTask(req, res) {
    const { title } = req.body;

    if (
        typeof title !== "string" ||
        title.trim() === ""
    ) {
        return res.status(400).json({
            message: "Kindly provide the title for the task"
        });
    }

    const result = db
        .prepare(
            "INSERT INTO tasks (title, done) VALUES (?, ?)"
        )
        .run(title, 0);

    const row = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(result.lastInsertRowid);

    return res.status(201).json({
        message: "Task Created successfully",
        task: formatTask(row)
    });
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
function updateTask(req, res) {
    const id = Number(req.params.id);
    const { title, done } = req.body;

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

    const existingTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);

    if (!existingTask) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const updatedTitle =
        title !== undefined
            ? title
            : existingTask.title;

    const updatedDone =
        done !== undefined
            ? Number(done)
            : existingTask.done;

    db.prepare(`
        UPDATE tasks
        SET title = ?, done = ?
        WHERE id = ?
    `).run(
        updatedTitle,
        updatedDone,
        id
    );

    const updatedTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);

    return res.status(200).json({
        message: "task updated successfully",
        task: formatTask(updatedTask)
    });
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
function deleteTask(req, res) {
    const id = Number(req.params.id);

    const result = db
        .prepare("DELETE FROM tasks WHERE id = ?")
        .run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    return res.status(204).send();
}
module.exports={getAllTasks,getTaskById,createTask,updateTask,deleteTask}