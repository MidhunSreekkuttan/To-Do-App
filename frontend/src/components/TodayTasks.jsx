import { useState } from 'react';
import TaskDetails from './TaskDetails';
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import LoadingScreen from '../lib/LoadingScreen';
import axiosInstance from '../lib/AxiosInstance';

const TodayTasks = ({ searchQuery }) => {

  const [selectedTask, setSelectedTask] = useState(null)

  const getTaskData = async () => {

    const token = localStorage.getItem("loginToken")

    try {

      const { data } = await axiosInstance.get('/api/task/getTaskData',
        { headers: { Authorization: token } }
      )

      if (!data.success) {
        throw new Error(data.message)
      }

      return data?.taskData

    } catch (error) {
      console.log(error);
      throw new Error(error.message)
    }

  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["taskData"],
    queryFn: getTaskData
  })

  const taskData = data || []

  const searchFilter = taskData.filter(items => items.title.toLowerCase().includes(searchQuery.toLowerCase()))

  if (error) return toast.error(error.message, { position: "top-right" })

  return (
    <>
      {isLoading && <LoadingScreen />}

      <div>

        {/* Header Section */}
        <div className="mb-4 text-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Total Tasks
            <span className="text-gray-500 text-sm font-normal">({taskData.length})</span>
          </h2>
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-3 max-h-[63vh] overflow-y-auto">
          {searchFilter.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white py-3 px-4 rounded-xl shadow-sm border
               border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              {/* Left side: Checkbox and Text */}
              <div className="flex items-center gap-4">

                {/* Circular Checkbox */}
                <label
                  className="relative flex items-center justify-center cursor-pointer"
                  // Stop the click from opening the TaskDetails modal when clicking the checkbox area
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="sr-only" // sr-only hides it visually but keeps it working for screen readers and forms
                    checked={item.completed}
                    readOnly
                  />

                  {/* The VISUAL custom checkbox (your existing styling) */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${item.completed
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300 hover:border-blue-400'
                      }`}
                  >
                    {item.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </label>

                {/* Task Details */}
                <div className="flex flex-col">
                  <span className={`text-base font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                    {item.title}
                  </span>
                  <span className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                    {item.completed && (
                      <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {item.description}
                  </span>
                </div>
              </div>

              {/* Right side: Options Icon */}
              <button onClick={() => setSelectedTask(item)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>

            </div>
          ))}
        </div>

        {selectedTask && <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} />}

      </div>

    </>
  );
};

export default TodayTasks;