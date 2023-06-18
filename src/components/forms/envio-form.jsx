import {
    Button,
    Grid,
    TextField,
    Typography,
    Autocomplete,
  } from "@mui/material";
  import { Form, Formik, useFormik, Field, ErrorMessage } from "formik";
  import * as Yup from "yup";
  import moment from "moment";
  import { useState, useEffect } from "react";
  import EnvioService from "../../services/envios";

  const EnvioSchema = Yup.object().shape({
    IdPed: Yup.number().nullable().required("El campo pedido es requerido"),
    Codigo: Yup.string().required("Requerido"),
    Fecha: Yup.date().required("Requerido"),
    FechaEntregaEstimada: Yup.date().required("Requerido"),
    DireccionOrigen: Yup.string().required("Requerido"),
    DireccionDestino: Yup.string().required("Requerido"),
    MetodoEnvio: Yup.string().required("Requerido"),
    EstadoActual: Yup.string().required("Requerido"),
    Notas: Yup.string().required("Requerido"),
    CostoEnvio: Yup.number().required("Campo requerido"),
    Productos: Yup.array().required("Campo requerido"),
  });
  
  
  export default function FormularioEnvio({ envio = {}, onSubmit, labelSubmit, iconSubmit }) {
  
    const [pedidos, setPedido] = useState([]);
    const [productosPedido, setProductosPedido] = useState([]);
    const [ pedidoSeleccionado, setPedidoSeleccionado ] = useState("");
  
    const fetchPedidos = async () => {
      try {
        const response = await EnvioService.getPedidos();
        // const json = await response.json();
        console.log(response)
        setPedido(response);
      } catch (error) {
        console.log(error)
      }
    };
  
    useEffect(() => {
      fetchPedidos();
    }, []);
  
    const handleSelectChange = async (value) => {
      console.log(value)
      formik.setFieldValue("IdPed", value? value.idPed : null );
      setPedidoSeleccionado(value);
      if (value) {
        try {
          const pedido = await EnvioService.getProductosXPedidos(value.idPed);
          setProductosPedido(pedido);
        } catch (error) {
          console.log(error);
        }
      } else {
        setProductosPedido(null);
      }
    };
  
    const initialValues = (envio) => ({
      IdPed: pedidoSeleccionado !== "" ? pedidoSeleccionado : null,
      Productos: [],
    });
  
    const formik = useFormik({
      initialValues: initialValues(envio),
      validationSchema: EnvioSchema,
      onSubmit: onSubmit,
    });


    // INICIO LOGICA DE PRODUCTOS SELECCIONADOS
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    const handleProductoSeleccionado = (idProducto) => {
      const productoSeleccionado = productosPedido.find(
        (producto) => producto.producto?.id_pro === idProducto
      );
    
      if (productoSeleccionado) {
        const productoYaSeleccionado = productosSeleccionados.some(
          (seleccionado) => seleccionado.producto?.id_pro === idProducto
        );
    
        if (productoYaSeleccionado) {
          // Deseleccionar el producto
          const nuevosProductosSeleccionados = productosSeleccionados.filter(
            (seleccionado) => seleccionado.producto?.id_pro !== idProducto
          );
          setProductosSeleccionados(nuevosProductosSeleccionados);
          const ids = nuevosProductosSeleccionados.map((seleccionado) => ({
            IdProd: seleccionado.producto?.id_pro
          }));
          formik.setFieldValue("Productos", ids);
        } else {
          // Seleccionar el producto
          setProductosSeleccionados([
            ...productosSeleccionados,
            productoSeleccionado
          ]);
          const ids = [...productosSeleccionados, productoSeleccionado].map((seleccionado) => ({
            IdProd: seleccionado.producto?.id_pro
          }));
          formik.setFieldValue("Productos", ids);
        }
      }
    };
    // FIN LOGICA DE PRODUCTOS SELECCIONADOS

    return (
      <>
        <Formik>
          <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="submit"
                onAbort={formik.handleSubmit}
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
                endIcon={iconSubmit}
              >
                {labelSubmit}
              </Button>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                gap: "20px",
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  flex: 1,
                }}
              >
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={pedidos}
                    sx={{ width: "100%" }}
                    value={pedidoSeleccionado}
                    getOptionLabel={(option) => option.codigo || "" }
                    isOptionEqualToValue={(option, value) =>  option.value === value.value}
                    onChange={(event, value) => handleSelectChange(value)}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Pedido"
                        name="IdPed"
                        error={
                          formik.touched.IdPed &&
                          Boolean(formik.errors.IdPed)
                        }
                        helperText={
                          formik.touched.IdPed &&
                          formik.errors.IdPed
                        }/>
                    )}
                  />
                  {pedidoSeleccionado && (
                    <>
                      <br />
                      <Typography variant="h4" gutterBottom>
                        Detalle del pedido
                      </Typography>
                      <Typography variant="h5" gutterBottom>
                        Datos del cliente
                      </Typography>
                      <p>Nombres: {pedidoSeleccionado.cliente?.nombres}</p>
                      <p>Apellidos: {pedidoSeleccionado.cliente?.apellidos}</p>
                      {/* Mostrar más detalles del cliente si es necesario */}
                      <Typography variant="h5" gutterBottom>
                        Productos del pedido
                      </Typography>
                      <ul>
                        {productosPedido?.map((producto) => (
                          <li key={producto.producto?.id_pro}>
                            <p>Nombre: {producto.producto?.nombre}</p>
                            <p>Precio: {producto.producto?.precio}</p>
                            <p>Cantidad: {producto.cantidad}</p>
                            {/* Mostrar más detalles del producto si es necesario */}
                          </li>
                        ))}
                      </ul>
                      <br />
                      <Grid sx={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1, }} >
                        <Typography variant="h4" gutterBottom>
                          Productos a enviar
                        </Typography>
                        <Grid item xs={12} sm={6}>
                          {/* Sección de selección de productos para enviar */}
                          <Typography variant="h6" gutterBottom>
                          Seleccionar productos para enviar
                          </Typography>
                          <ul>
                            {productosPedido.map((producto) => (
                              <li key={producto.producto?.id_pro}>
                                <input
                                  type="checkbox"
                                  checked={productosSeleccionados.some(
                                    (seleccionado) => seleccionado.producto?.id_pro === producto.producto?.id_pro
                                  )}
                                  onChange={() => handleProductoSeleccionado(producto.producto?.id_pro)}
                                />
                                <label>{producto.producto?.nombre}</label>
                              </li>
                            ))}
                          </ul>

                          {/* Mostrar los productos seleccionados */}
                          <Typography variant="h6" gutterBottom>
                            Productos seleccionados para enviar
                          </Typography>
                          <ul>
                            {productosSeleccionados.map((producto) => (
                              <li key={producto.producto?.id_pro}>{producto.producto?.nombre}</li>
                            ))}
                          </ul>
                        </Grid>
                      </Grid>
                      <br />
                      <Grid sx={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1, }} >
                        <Typography variant="h4" gutterBottom>
                          Datos del envío
                        </Typography>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Código"
                            name="codigo"
                            value={formik.values.Codigo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.Codigo &&
                              Boolean(formik.errors.Codigo)
                            }
                            helperText={
                              formik.touched.Codigo &&
                              formik.errors.Codigo
                            }
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </Formik>
        
      </>
    );
  }
  