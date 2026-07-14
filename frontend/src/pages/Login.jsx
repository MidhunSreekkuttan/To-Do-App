import { useState } from "react"
import { LabelField } from "../lib/bottons"

const Login = () => {

    const [state, setState] = useState("login")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const onChangeFn = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-rose-100">

            <div className="h-fit w-lg bg-amber-50 rounded-2xl p-5 px-15">
                <h1 className="text-5xl font-bold text-center">
                    {state === "login" ? "Login" : "SignUp"}
                </h1>

                <form className="flex flex-col gap-3 mt-5 pb-3">
                    {state === "signUp" &&
                        <LabelField
                            text="Name"
                            textColor="text-gray-600"
                            name="name"
                            value={formData.name}
                            onChange={onChangeFn}
                            placeholder="Enter your Name"
                            type="text"
                            textSize="text-lg"
                            otherCss="focus:ring-rose-400 border border-gray-400"
                        />
                    }

                    <LabelField
                        text="Email"
                        textColor="text-gray-600"
                        name="email"
                        value={formData.email}
                        onChange={onChangeFn}
                        placeholder="Enter your Email"
                        type="email"
                        textSize="text-lg"
                        otherCss="focus:ring-rose-400 border border-gray-400"
                    />

                    <LabelField
                        text="Password"
                        textColor="text-gray-600"
                        name="password"
                        value={formData.password}
                        onChange={onChangeFn}
                        placeholder="Enter your Password"
                        type="password"
                        textSize="text-lg"
                        otherCss="focus:ring-rose-400 border border-gray-400"
                    />

                    {state === "login" && (
                        <button type="button"
                            className="text-sm text-slate-500 hover:text-slate-800 flex justify-end font-medium 
                                transition-colors">
                            Forgot Password?
                        </button>
                    )}

                    <button type="submit" className="w-full py-2 text-center bg-rose-200 rounded-lg text-2xl font-semibold mb-2">
                        Submit
                    </button>

                    <p className="flex justify-end">
                        {state === "login" ? "If You have no accound:" : "You already have an accound:"}
                        <span className="underline text-blue-600 cursor-pointer">
                            {state === "login" ? (
                                <span onClick={() => {
                                    setState("signUp")
                                    setFormData({ name: "", email: "", password: "" })
                                }}>SignUp</span>
                            ) : (
                                <span onClick={() => {
                                    setState("login")
                                    setFormData({ name: "", email: "", password: "" })
                                }}>Login</span>
                            )}
                        </span>
                    </p>

                </form>
            </div>

        </div>
    )
}

export default Login