import React from 'react';

const tasksData = [
  {
    id: 1,
    title: "Buy groceries for dinner",
    description: "Time: 5:00 PM",
    completed: true
  },
  {
    id: 2,
    title: "Complete UI wireframes for app",
    description: "Time: 2:00 PM • Priority: High",
    completed: false
  },
  {
    id: 3,
    title: "Schedule dentist appointment",
    description: "Time: 10:00 AM",
    completed: false
  },
  {
    id: 4,
    title: "Workout session",
    description: "Done, 7:00 AM",
    completed: true
  },
  {
    id: 5,
    title: "Workout session",
    description: "Done, 7:00 AM",
    completed: true
  },
  {
    id: 6,
    title: "Workout session",
    description: "Done, 7:00 AM",
    completed: true
  },
  {
    id: 7,
    title: "Workout session",
    description: "Done, 7:00 AM",
    completed: true
  }
];

const TodayTasks = ({ searchQuery }) => {
  return (
    // Assuming the parent container has a light gray/blue background like the mockup
    <div>

      {/* Header Section */}
      <div className="mb-4 text-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Total Tasks
          <span className="text-gray-500 text-sm font-normal">({tasksData.length})</span>
        </h2>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3 max-h-[63vh] overflow-y-auto">
        {tasksData.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white py-3 px-4 rounded-xl shadow-sm border
               border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            {/* Left side: Checkbox and Text */}
            <div className="flex items-center gap-4">

              {/* Circular Checkbox */}
              <label
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
            <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayTasks;