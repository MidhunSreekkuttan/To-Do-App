import TaskModel from "../data-base/models/taskModel.js"

export const createTask = async (req, res) => {

    try {

        const userId = req.userId

        const { title, description } = req.body
        if (!title || !description) {
            return res.json({ success: false, message: "enter credentials" })
        }

        const task = await TaskModel({
            userId,
            title,
            description
        })

        await task.save()

        res.json({ success: true, message: "Task created" })

    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error);
    }

}

export const getTaskData = async (req, res) => {

    try {

        const userId = req.userId

        const user = await TaskModel.find({ userId: userId })
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }

        res.json({ success: true, taskData: user })

    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error);
    }

}

export const changeTaskData = async (req, res) => {
    try {

        const userId = req.userId
        const { taskId } = req.params
        const { status } = req.body
        if (!taskId) return res.json({ success: false, message: "taskId missing" })
        if (status === undefined) return res.json({ success: false, message: "status is missing" })

        const user = await TaskModel.findOne({ userId: userId })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        await TaskModel.findByIdAndUpdate({ _id: taskId }, { completed: status })

        res.json({ success: true, message: "status changed" })

    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error);
    }
}

export const deleteTask = async (req, res) => {

    try {

        const userId = req.userId

        const user = await TaskModel.findOneAndDelete({ userId: userId })
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }

        res.json({ success: true, message: "task deleted" })

    } catch (error) {
        res.json({ success: false, message: error.message })
        console.log(error);
    }

}