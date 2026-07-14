const CreateTask = ({ onFormClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">

      <div className="relative w-full max-w-lg bg-amber-50 rounded-2xl py-6 px-8 shadow-2xl">

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
        <form className="flex flex-col gap-6">

          <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
            Task Title
            <input
              className="w-full text-base py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border
                 border-gray-400 rounded-lg"
              type="text"
              placeholder="e.g., Send team meeting agenda"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
            Notes/Description
            <textarea
              rows={4}
              className="w-full text-base py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border
                 border-gray-400 rounded-lg resize-none"
              placeholder="Add any extra details here..."
            />
          </label>

          <button
            type="submit"
            className="mt-2 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Task
          </button>

        </form>

      </div>
    </div>
  );
}

export default CreateTask;