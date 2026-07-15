export const LoadingScreen = () => {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">

                <div className="flex flex-col space-y-3 justify-center items-center">
                    <div
                        className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'
                        role="status"
                        aria-label="loading"
                    >
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className="font-semibold text-gray-700">Please wait...</p>
                </div>

            </div>
        </div>
    );
};

export const CompLoadingScreen = () => {
    return (

        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">

                <div className="flex flex-col space-y-3 justify-center items-center">
                    <div
                        className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'
                        role="status"
                        aria-label="loading"
                    >
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className="font-semibold text-gray-700">Please wait...</p>
                </div>

            </div>
        </div>

    )
}

