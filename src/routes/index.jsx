import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/auth/protectedRoute";
import AuthLayout from "../layout/auth";
import LoginForm from "../components/auth";
import Inicio from '../views/inicio';
import Layout from '../layout/main';
import Envios from '../views/envios/index';
import NuevoEnvio from '../views/envios/crear-envio';



const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <Layout />,
                children: [
                    {
                        path: '/',
                        element: <Inicio />,
                    },
                    {
                        path: '/inicio',
                        element: <Inicio />,
                    },
                    {
                        path: "/store",
                        element: <ProtectedRoute rol="cliente" />,
                        children: [
                            {
                                path: "/store",
                                element: <h1>Layout</h1>
                            },
                            {
                                path: "/store/index",
                                element: <h1>Inicio</h1>
                            },
                            {
                                path: "/store/cart",
                                element: <h1>Carrito</h1>
                            }
                        ]
                    },
                    {
                        path: "/logistics",
                        element: <ProtectedRoute rol="logistica" />,
                        children: [
                            {
                                path: "/logistics/index",
                                element: <h1>Inicio</h1>
                            },
                            {
                                path: "/logistics/orders",
                                element: <h1>Pedidos</h1>
                            }
                        ]
                    },
                    {
                        path: "/transport",
                        element: <ProtectedRoute rol="transporte" />,
                        children: [
                            {
                                path: "/transport/index",
                                element: <Envios />
                            },
                            {
                                path: "/transport/create",
                                element: <NuevoEnvio />
                            },
                            {
                                path: "/transport/orders",
                                element: <h1>Pedidos</h1>
                            }
                        ]
                    }
                ]
            },
        ]
    },    
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "/auth/login",
                element: <LoginForm />
            }
        ]
    },
    {
        path: "/not-authorized",
        element: <h1>Not Authorized</h1>
    },
    {
        path: "*",
        element: <h1>Not Found</h1>
    }
]);

export default	router;