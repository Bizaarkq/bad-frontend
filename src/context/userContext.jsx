import React, {useContext, useState, useEffect} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const UserContext = React.createContext({});

export function UserProvider({children}) {
    const [user, setUser] = useState({});
    const [userlocal, setUserlocal] = useLocalStorage("user", {});
    console.log("contexto hook", user, userlocal);
    
    useEffect(() => {
        setUserlocal(user);
    }, [user]);

    useEffect(() => {
        if (Object.keys(userlocal).length) {
            setUser(userlocal);
        }
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}


export const useAuth = () => useContext(UserContext);
export default UserContext;