const url = "localhost:5164/api";

export const endpoints = {
    auth: {
        login: `http://${url}/Auth/Login`
    }
}

export const envios = {
    getEnvios: `http://${url}/envio`,
    createEnvio: `http://${url}/envio`,
}

export const pedidos = {
    getPedidos: `http://${url}/Pedido`,
    getProductosXPedido: `http://${url}/Pedido/productos-pedido`,
}

export const producto = {
    getProductos: `http://${url}/Producto`,
}