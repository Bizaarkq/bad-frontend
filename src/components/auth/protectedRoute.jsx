import { useContext, useEffect } from "react";
import { useOutlet } from "react-router-dom";
import UserContext from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function ProtectedRoute ({ rol }) {
    const outlet = useOutlet();
    const navigate = useNavigate();
    const [ user, setUser ] = useLocalStorage("user", {});

    console.log("ProtectedRoute.jsx: user: ", user)

    useEffect(() => {
        if (!Object.keys(user).length) {
            navigate("/auth/login");
        }
        
        if (Object.keys(user).length && user.roles.includes(rol)) {
            navigate("/not-authorized");
        }

    }, [user]);

    return outlet;
}