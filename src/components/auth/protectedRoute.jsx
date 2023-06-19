import { useEffect } from "react";
import { useOutlet } from "react-router-dom";
import { useAuth } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ rol }) {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  console.log("ProtectedRoute.jsx: user: ", user);

  useEffect(() => {
    if (!Object.keys(user).length) {
      navigate("/auth/login");
    }

    if (Object.keys(user).length && !user.roles.some((r) => rol.includes(r))) {
      navigate("/not-authorized");
    }
  }, [user]);

  return outlet;
}
