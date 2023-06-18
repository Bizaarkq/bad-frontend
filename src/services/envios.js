import { envios, pedidos, producto } from "./endpoints";
import Axios from "axios";

export const getAll = async () => {
    const response = await Axios.get(envios.getEnvios);
    return response.data;
}

export const create = async (data) => {
    const response = await Axios.post(envios.createEnvio, data);
    return response.data;
}

// get de pedidos
export const getPedidos = async () => {
    const response = await Axios.get(pedidos.getPedidos);
    return response.data;
}
// get de productos x pedido
export const getProductosXPedidos = async (id) => {
    const response = await Axios.get(pedidos.getProductosXPedido + '/' + id);
    return response.data;
}
// get de productos
export const getProductos = async () => {
    const response = await Axios.get(producto.getProductos);
    return response.data;
}

export default {
    getAll,
    create,
    getPedidos,
    getProductos,
    getProductosXPedidos
}