import { createContext, useState } from "react";

export const Context = createContext()

const ContextProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedin] = useState(false)

    const values = {
        isLoggedIn, setIsLoggedin
    }

    return (
        <Context.Provider value={values}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider