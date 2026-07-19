import { lazy, Suspense, useState } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom'
import { FaSearch, FaBars } from "react-icons/fa"; // Added FaBars for hamburger menu
import CreateTask from '../components/CreateTask';
import { CompLoadingScreen } from '../lib/LoadingScreen';

const TodayTasks = lazy(() => import('../components/TodayTasks'))
const UpcomingTasks = lazy(() => import('../components/UpcomingTasks'))
const Settings = lazy(() => import('../components/Settings'))

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { setIsSidebarOpen } = useOutletContext(); // Get state from Layout

  const currentTab = searchParams.get("tab") || "today"
  const searchQuery = searchParams.get("search") || ""

  const handleSearch = (e) => {
    e.preventDefault()
    const text = e.target.value
    setSearchParams(prevParams => {
      if (text) prevParams.set("search", text)
      else prevParams.delete("search")
      return prevParams
    }, { replace: true })
  }

  const myDate = new Date()
  const formattedDate = myDate.toLocaleDateString("en-Us", {
    weekday: "long", month: "long", year: "numeric"
  })

  const hideActionButton = currentTab !== "settings" && currentTab !== "upcoming";

  return (
    <main className='w-full h-full flex flex-col overflow-hidden'>

      <div className='flex flex-col shrink-0 pt-4 px-4 md:pt-8 md:px-8'>
        <div className="flex items-center gap-3">
          <h1 className='font-bold text-3xl md:text-5xl'>
            {currentTab === "settings" ? "Settings" : "My Tasks"}
          </h1>
        </div>

        {currentTab === "today" && <p className='text-lg md:text-xl mt-2 font-medium text-slate-500'>{formattedDate}</p>}

        {currentTab !== "settings" &&
          <label className={`flex items-center gap-2 bg-gray-200 w-full ${currentTab === "today" ? "mt-4 md:mt-5" : "mt-6 md:mt-8"} py-2.5 px-4 rounded-lg mb-4 md:mb-6`}>
            <FaSearch size={18} color='gray' />
            <input className='w-full font-medium text-base md:text-lg text-slate-700 bg-transparent focus:outline-none'
              type="text"
              placeholder='Search Tasks'
              value={searchQuery}
              onChange={handleSearch}
            />
          </label>
        }
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-24">
        {currentTab === "today" && <Suspense fallback={<CompLoadingScreen />}><TodayTasks searchQuery={searchQuery} /></Suspense>}
        {currentTab === "upcoming" && <Suspense fallback={<CompLoadingScreen />}><UpcomingTasks searchQuery={searchQuery} /></Suspense>}
        {currentTab === "settings" && <Suspense fallback={<CompLoadingScreen />}><Settings /></Suspense>}
      </div>

      {/* Floating Action Button */}
      {hideActionButton &&
        <button
          type='button'
          onClick={() => setIsFormOpen(true)}
          className='fixed cursor-pointer flex justify-center items-center bottom-6 right-6 md:bottom-10 md:right-10 bg-blue-500 hover:bg-blue-600 transition-colors shadow-xl rounded-full text-white h-16 w-16 md:h-20 md:w-20 z-20'
        >
          <span className='text-5xl md:text-7xl md:mb-4'>+</span>
        </button>
      }

      {isFormOpen && <CreateTask onFormClose={() => setIsFormOpen(false)} />}
    </main>
  )
}

export default Home