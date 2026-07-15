import { lazy, Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";
import CreateTask from '../components/CreateTask';
import { CompLoadingScreen } from '../lib/LoadingScreen';

const TodayTasks = lazy(() => import('../components/TodayTasks'))
const UpcomingTasks = lazy(() => import('../components/UpcomingTasks'))
const Settings = lazy(() => import('../components/Settings'))

const Home = () => {

  const [searchParams, setSearchParams] = useSearchParams()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const currentTab = searchParams.get("tab") || "today"
  const searchQuery = searchParams.get("search") || ""

  const handleSearch = (e) => {
    e.preventDefault()

    const text = e.target.value

    setSearchParams(prevParams => {
      if (text) {
        prevParams.set("search", text)
      } else {
        prevParams.delete("search")
      }

      return prevParams

    }, { replace: true })
  }

  const myDate = new Date()
  const formattedDate = myDate.toLocaleDateString("en-Us", {
    weekday: "long",
    month: "long",
    year: "numeric"
  })

  const hideActionButton = currentTab !== "settings" && currentTab !== "upcoming";

  return (
    <main className='relative w-full h-screen p-5'>

      <div className='flex flex-col'>
        <h1 className='font-bold text-5xl'> My&nbsp;
          {currentTab === "today" && "Today Tasks"}
          {currentTab === "upcoming" && "Upcoming Tasks"}
          {currentTab === "settings" && "Settings"}
        </h1>
        {currentTab === "today" && <p className='text-2xl mt-2 font-medium text-slate-500'>{formattedDate}</p>}

        {currentTab !== "settings" &&

          < label className={`flex items-center gap-2 bg-gray-200 w-full ${currentTab === "today" ? "mt-5" : "mt-8"}
             py-2 px-5 rounded-lg mb-7`}>

            <FaSearch size={20} color='gray' />
            <input className='w-full font-medium text-lg text-slate-500 focus:outline-none'
              type="text"
              placeholder='Search Tasks'
              value={searchQuery}
              onChange={handleSearch}
            />

          </label>
        }

        {/* Tday tasks */}
        {currentTab === "today" &&
          <Suspense fallback={<CompLoadingScreen />}>
            <TodayTasks searchQuery={searchQuery} />
          </Suspense>
        }

        {/* Upcoming Tasks */}
        {currentTab === "upcoming" &&
          <Suspense fallback={<CompLoadingScreen />}>
            <UpcomingTasks searchQuery={searchQuery} />
          </Suspense>
        }

        {/* Settings */}
        {currentTab === "settings" &&
          <Suspense fallback={<CompLoadingScreen />}>
            <Settings />
          </Suspense>
        }
      </div>

      {/* Floating Action Button */}
      {hideActionButton &&

        <button
          type='button'
          onClick={() => setIsFormOpen(true)}
          className='absolute cursor-pointer flex justify-center bottom-10 right-10
           bg-blue-500 rounded-full text-white h-20 w-20'
        >
          <h1 className='bottom-4 absolute text-6xl'>+</h1>
        </button>

      }

      {isFormOpen && <CreateTask onFormClose={() => setIsFormOpen(false)} />}

    </main >
  )
}

export default Home