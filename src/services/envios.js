import { envios, pedidos, producto, bodega, seguimientos } from "./endpoints";
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
// get de bodega
export const getBodegas = async () => {
    const response = await Axios.get(bodega.getBodegas);
    return response.data;
}

// get de seguimientos por envio
export const getSeguimientosXEnvio = async (id) => {
    const response = await Axios.get(envios.getSeguimientos + '/' + id);
    return response.data;
}

// post de seguimientos
export const createSeguimiento = async (data) => {
    const response = await Axios.post(seguimientos.createSeguimiento, data);
    return response.data;
}

export default {
    getAll,
    create,
    getPedidos,
    getProductos,
    getProductosXPedidos,
    getBodegas,
    getSeguimientosXEnvio,
    createSeguimiento
}