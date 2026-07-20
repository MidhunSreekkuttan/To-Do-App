import { useEffect, useRef, useState } from "react";
import { toast } from 'react-hot-toast'
import { LabelField } from "../lib/bottons";
import axiosInstance from "../lib/AxiosInstance";
import { useMutation, useQueryClient } from '@tanstack/react-query'

const CreateTask = ({ onFormClose }) => {

  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: "",
    description: ""
  })
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  const taskRef = useRef(null)
  const dateRef = useRef(null)
  const timeRef = useRef(null)
  const descriptionRef = useRef(null)

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {

    const pressKey = (e) => {
      if (e.key === "Escape") {
        onFormClose()
      } else return
    }

    taskRef.current.focus()

    window.addEventListener("keydown", pressKey)

    return () => window.removeEventListener("keydown", pressKey)

  }, [onFormClose])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    let taskPayload = { ...formData }

    if (date) {
      const selectedDateTime = new Date(`${date}T${time || "00:00"}`)
      const now = new Date()

      if (selectedDateTime < now) {
        return toast.error("Due date and time cannot be in the past", { position: "top-right" })
      }

      taskPayload.date = selectedDateTime.toISOString()
    }

    handleSubmitMutation.mutate(taskPayload)

  }

  const handleSubmitMutation = useMutation({

    mutationFn: async (taskData) => {
      const token = localStorage.getItem("loginToken");

      const { data } = await axiosInstance.post('/api/task/createTask', taskData, {
        headers: { Authorization: token }
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to create task");
      }
      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message, { position: "top-right" });
      onFormClose();
    },

    onError: (err) => {
      toast.error(err.message, { position: "top-right" });
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: ["taskData"] })

  })

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">

      <div className="relative w-full max-w-lg bg-amber-50 rounded-2xl py-6 px-5 md:px-8 shadow-2xl mx-4">

        {/* --- HEADER --- */}
        <div className="flex flex-col mb-6">
          <button
            onClick={onFormClose}
            className="absolute right-6 top-6 text-2xl font-bold text-gray-500 hover:text-gray-800 transition-colors
             cursor-pointer"
            aria-label="Close form"
          >
            ✕
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Create New Task</h1>
          <hr className="w-full mt-4 border-gray-300" />
        </div>

        {/* --- FORM --- */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <LabelField
            text="Task Title"
            ref={taskRef}
            type="text"
            textColor="text-gray-700"
            textSize="text-sm"
            otherCss="focus:ring-blue-500 border border-gray-400"
            placeholder="e.g., Send team meeting agenda"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault()
                dateRef.current.focus()
              }
            }}
          />

          {/* Due Date & Time */}
          <div className="flex justify-between gap-4">
            <label className="flex flex-col gap-1.5 w-1/2 text-sm font-semibold text-gray-800">
              Due Date
              <div className="relative">
                <input
                  ref={dateRef}
                  type="date"
                  min={today}
                  className="w-full text-sm py-2.5 px-3 bg-transparent border border-gray-300 rounded-md
                     text-gray-600 focus:outline-none focus:border-gray-400"
                  onChange={e => setDate(e.target.value)}
                  value={date}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      timeRef.current.focus()
                    }
                  }}
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5 w-1/2 text-sm font-semibold text-gray-800">
              Time
              <div className="relative">
                <input
                  ref={timeRef}
                  type="time"
                  className="w-full text-sm py-2.5 px-3 bg-transparent border border-gray-300 rounded-md text-gray-600 
                    focus:outline-none focus:border-gray-400"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      descriptionRef.current.focus()
                    }
                  }}
                />
              </div>
            </label>
          </div>

          <LabelField
            text="Notes/Description"
            type="textarea"
            textColor="text-gray-700"
            textSize="text-sm"
            otherCss="focus:ring-blue-500 border border-gray-400 resize-none"
            ref={descriptionRef}
            rows={4}
            placeholder="Add any extra details here..."
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="mt-2 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {handleSubmitMutation.isPending ? (
              <div className="flex flex-row-reverse gap-3 justify-center items-center">
                <div
                  className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin'
                  role="status"
                  aria-label="loading"
                />
                <p className="font-semibold text-white">Processing...</p>
              </div>
            ) : (
              "Create Task"
            )}
          </button>

        </form>

      </div>
    </div>
  );
}

export default CreateTask;