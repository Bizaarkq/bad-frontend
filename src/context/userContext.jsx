import React, {useContext, useState, useEffect} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const UserContext = React.createContext({});

export function UserProvider({children}) {
    const [user, setUser] = useState({});
    const [token, setToken] = useLocalStorage("token", "");
    const [userlocal, setUserlocal] = useLocalStorage("user", {});

    useEffect(() => {
        if (Object.keys(user).length) {
            setToken(user.access_token);
            setUserlocal(user);
        }

        if (Object.keys(userlocal).length) {
            setUser(userlocal);
        }

        console.log("userContext.jsx: user after check: ", user)
    }, [user]);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}


export const useAuth = () => useContext(UserContext);
export default UserContext;