import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/auth/protectedRoute";
import AuthLayout from "../layout/auth";
import LoginForm from "../components/auth";
import Inicio from '../views/inicio';
import Layout from '../layout/main';
import Envios from '../views/envios/index';
import SeguimientoEnvio from '../views/seguimientoEnvios/index';
import NuevoEnvio from '../views/envios/crear-envio';
import Store from "../views/carrito";
import { menu } from '../services/constantes';
import PagoCarrito from "../views/carrito/pagoCarrito";


const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute rol={["cliente", "logistica", "transporte"]}/>,
        children: [
            {
                path: "/",
                element: <Layout />,
                children: [
                    {
                        path: "/store",
                        element: <ProtectedRoute rol={["cliente"]} />,
                        children: [
                            {
                                path: "/store",
                                element: <Inicio menu={menu.cliente} />
                            },
                            {
                                path: "/store/shop",
                                element: <Store />
                            },
                            {
                                path: "/store/cart",
                                element: <PagoCarrito />
                            }
                        ]
                    },
                    {
                        path: "/logistica",
                        element: <ProtectedRoute rol={["logistica"]} />,
                        children: [
                            {
                                path: "/logistica",
                                element: <Inicio menu={menu.logistica} />
                            },
                            {
                                path: "/logistica/envios",
                                element: <Envios />
                            },
                            {
                                path: "/logistica/nuevo-envio",
                                element: <NuevoEnvio />
                            }
                        ]
                    },
                    {
                        path: "/transporte",
                        element: <ProtectedRoute rol={["transporte"]} />,
                        children: [
                            {
                                path: "/transporte",
                                element: <Inicio menu={menu.transporte} />
                            },
                            {
                                path: "/transporte/orders",
                                element: <h1>Pedidos</h1>
                            },
                            {
                                path: "/transporte/envios",
                                element: <SeguimientoEnvio />
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