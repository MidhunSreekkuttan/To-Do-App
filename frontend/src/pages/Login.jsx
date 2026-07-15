import { useState, useRef, useContext } from "react"
import { LabelField } from "../lib/bottons"
import axiosInstance from "../lib/AxiosInstance"
import { toast } from 'react-hot-toast'
import { Context } from "../lib/Context"
import { useNavigate } from 'react-router-dom'
import LoadingScreen from "../lib/LoadingScreen"

const Login = () => {

    const { setIsLoggedin } = useContext(Context)

    const [state, setState] = useState("login")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)

    const nameRef = useRef(null)
    const navigate = useNavigate()

    const onChangeFn = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        if (state === "signUp") {
            try {
                setLoading(true)
                const { data } = await axiosInstance.post('api/user/register', formData)

                if (data.success) {
                    toast.success("Your Account created successfully", {
                        position: "top-right",
                        duration: 3000
                    })
                    setState("login")
                } else {
                    toast.error(data.message, {
                        position: "top-right",
                        duration: 3000,
                        style: { background: '#333', color: '#fff' },
                    });
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message, { position: "top-right" })
            } finally {
                setLoading(false)
            }
        } else {
            try {
                setLoading(true)
                const { data } = await axiosInstance.post('api/user/login', formData)

                if (data.success) {
                    localStorage.setItem("loginToken", data.token)
                    setIsLoggedin(true)
                    navigate(`/${data.userId}`)
                    toast.success("Logged in successfully", {
                        position: "top-right",
                        duration: 3000
                    })
                } else {
                    toast.error(data.message, {
                        position: "top-right",
                        duration: 3000,
                        style: { background: '#333', color: '#fff' }
                    })
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message, { position: "top-right" })
            } finally {
                setLoading(false)
            }
        }
    }

    return (

        <div className="w-screen h-screen flex justify-center items-center bg-gray-100">

            <div className="w-full max-w-md bg-amber-50 rounded-2xl py-8 px-10 shadow-2xl">

                {/* TaskFlow Branding */}
                <div className='flex flex-col items-center mb-6'>
                    <h1 className='font-bold text-4xl text-center text-blue-500'>
                        Task<span className='font-light text-slate-800'>Flow</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        {state === "login" ? "Welcome back! Please login." : "Create an account to get started."}
                    </p>
                </div>

                <form onSubmit={submitHandler} className="flex flex-col gap-5">

                    {state === "signUp" &&
                        <LabelField
                            ref={nameRef}
                            text="Name"
                            textColor="text-gray-700"
                            name="name"
                            value={formData.name}
                            onChange={onChangeFn}
                            placeholder="Enter your Name"
                            type="text"
                            textSize="text-sm"
                            otherCss="focus:ring-blue-500 border border-gray-400"
                        />
                    }

                    <LabelField
                        text="Email"
                        textColor="text-gray-700"
                        name="email"
                        value={formData.email}
                        onChange={onChangeFn}
                        placeholder="Enter your Email"
                        type="email"
                        textSize="text-sm"
                        otherCss="focus:ring-blue-500 border border-gray-400"
                    />

                    <LabelField
                        text="Password"
                        textColor="text-gray-700"
                        name="password"
                        value={formData.password}
                        onChange={onChangeFn}
                        placeholder="Enter your Password"
                        type="password"
                        textSize="text-sm"
                        otherCss="focus:ring-blue-500 border border-gray-400"
                    />

                    {state === "login" && (
                        <button type="button"
                            className="text-sm text-blue-500 hover:text-blue-700 flex justify-end font-medium transition-colors -mt-2 cursor-pointer">
                            Forgot Password?
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 
                            transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex flex-row-reverse gap-3 justify-center items-center">
                                <div
                                    className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin'
                                    role="status"
                                    aria-label="loading"
                                />
                                <p className="font-semibold text-white">Processing...</p>
                            </div>
                        ) : (
                            state === "login" ? "Login" : "Sign Up"
                        )}
                    </button>

                    <div className="flex justify-center mt-2 text-sm text-gray-600">
                        {state === "login" ? "Don't have an account? " : "Already have an account? "}
                        <span
                            className="ml-1 font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                            onClick={() => {
                                setState(state === "login" ? "signUp" : "login")
                                setFormData({ name: "", email: "", password: "" })
                            }}
                        >
                            {state === "login" ? "Sign Up" : "Login"}
                        </span>
                    </div>

                </form>
            </div>
        </div>

    )
}

export default Login