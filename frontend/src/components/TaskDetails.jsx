import { useCallback, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from "../lib/AxiosInstance";
import toast from "react-hot-toast";

const TaskDetails = ({ task, onClose }) => {

    if (!task) return null;

    const queryClient = useQueryClient()

    const deleteTaskMutation = useMutation({

        mutationFn: async (taskId) => {
            const token = localStorage.getItem("loginToken")

            const { data } = await axiosInstance.delete(`/api/task/deleteTask/${taskId}`, { headers: { Authorization: token } })

            if (!data.success) {
                throw new Error(data.message);
            }

            return data
        },

        onMutate: async (taskId) => {

            await queryClient.cancelQueries({ queryKey: ["taskData"] })

            const previousTasks = queryClient.getQueryData(["taskData"])

            queryClient.setQueryData(["taskData"], (oldData) => {
                if (!oldData) return []

                return oldData.filter(data => data._id !== taskId)
            })

            onClose();
            return { previousTasks }
        },

        onError: (err, _, context) => {
            queryClient.setQueryData(["taskData"], context.previousTasks)

            toast.error(err.message || "Failed to delete task", { position: "top-right" });
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ["taskData"] })

    })

    const deleteTask = useCallback((task) => {
        deleteTaskMutation.mutate(task)
    }, [deleteTaskMutation])

    useEffect(() => {

        const closeTab = (e) => {
            e.preventDefault()
            if (e.key === "Escape") return onClose()
        }

        window.addEventListener('keydown', closeTab)

        return () => window.removeEventListener('keydown', closeTab)
    }, [])

    return (
        <div className="absolute inset-0 flex items-center justify-center z-50 p-4">

            <div className="relative w-full max-w-lg bg-white rounded-2xl py-6 px-8 shadow-2xl">

                {/* --- HEADER --- */}
                <div className="flex flex-col mb-6">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-2xl font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                        aria-label="Close form"
                    >
                        ✕
                    </button>

                    <h1 className="text-2xl font-bold text-gray-800">Task Details</h1>
                    <hr className="w-full mt-4 border-gray-300" />
                </div>

                {/* --- CONTENT --- */}

                <div className="flex flex-col gap-6">

                    {/* Title Section */}
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Title</h2>
                        <p className="text-xl font-medium text-gray-900 mt-1 leading-snug">
                            {task.title}
                        </p>
                    </div>

                    {/* Description Section */}
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Notes / Description</h2>
                        <p className="text-base text-gray-700 mt-1 whitespace-pre-wrap">
                            {task.description}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</h2>
                        <div className="mt-2">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${task.completed
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}>
                                {task.completed ? '✓ Completed' : 'Pending'}
                            </span>
                        </div>
                    </div>

                </div>

                <button onClick={() => deleteTask(task._id)}
                    className="absolute right-8 bottom-4 w-40 py-1 px-6 rounded-lg text-2xl font-semibold bg-red-500
                    text-white flex gap-3 justify-between items-center">
                    <FaRegTrashAlt size={22} /> <span>Delete</span>
                </button>

            </div>
        </div>
    )
}

export default TaskDetails