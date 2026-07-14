import { lazy, Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";
import CreateTask from './CreateTask';

const TodayTasks = lazy(() => import('./TodayTasks'))
const UpcomingTasks = lazy(() => import('./UpcomingTasks'))
const Settings = lazy(() => import('./Settings'))

const Home = () => {

  const [searchParams] = useSearchParams()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const currentTab = searchParams.get("tab") || "today"

  const myDate = new Date()
  const formattedDate = myDate.toLocaleDateString("en-Us", {
    weekday: "long",
    month: "long",
    year: "numeric"
  })

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
              placeholder='Search Tasks' />

          </label>
        }

        {/* Tday tasks */}
        {currentTab === "today" &&
          <Suspense fallback={<div>Loading...</div>}>
            <TodayTasks />
          </Suspense>
        }

        {/* Upcoming Tasks */}
        {currentTab === "upcoming" &&
          <Suspense fallback={<div>Loading...</div>}>
            <UpcomingTasks />
          </Suspense>
        }

        {/* Settings */}
        {currentTab === "settings" &&
          <Suspense fallback={<div>Loading...</div>}>
            <Settings />
          </Suspense>
        }
      </div>

      {/* Floating Action Button */}
      {currentTab !== "settings" &&

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