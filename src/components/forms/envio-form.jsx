import {
  Button,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Card,
  CardContent,
  List, ListItem, ListItemIcon, ListItemText, Checkbox,
  } from "@mui/material";
  import { Form, Formik, useFormik, Field, ErrorMessage } from "formik";
  import * as Yup from "yup";
  import moment from "moment";
  import { useState, useEffect } from "react";
  import EnvioService from "../../services/envios";

  const EnvioSchema = Yup.object().shape({
    IdPed: Yup.number().required("El campo pedido es requerido"),
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
    IdBodega: Yup.number().required("El campo bodega es requerido"),
  });
  
  
  export default function FormularioEnvio({ envio = {}, onSubmit, labelSubmit, iconSubmit }) {
  
    const [pedidos, setPedido] = useState([]);
    const [productosPedido, setProductosPedido] = useState([]);
    const [ pedidoSeleccionado, setPedidoSeleccionado ] = useState("");
    const [bodegas, setBodegas] = useState([]);
    const [ bodegaSeleccionada, setBodegaSeleccionada ] = useState("");
  
    const fetchPedidos = async () => {
      try {
        const response = await EnvioService.getPedidos();
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
      formik.setFieldValue("IdPed", value? value.idPed : null );
      setPedidoSeleccionado(value);
      if (value) {
        try {
          const pedido = await EnvioService.getProductosXPedidos(value.idPed);
          setProductosPedido(pedido);
          const bodega = await EnvioService.getBodegas()
          setBodegas(bodega)
          console.log(bodega)
        } catch (error) {
          console.log(error);
        }
      } else {
        setProductosPedido(null);
      }
    };

    const handleSelectChangeBodega = async (value) => {
      formik.setFieldValue("IdBodega", value? value.idBodega : null );
      setBodegaSeleccionada(value);
    };
  
    const initialValues = (envio) => ({
      IdPed: pedidoSeleccionado !== "" ? pedidoSeleccionado : null,
      Productos: [],
      Codigo: "",
      Fecha: moment().format('YYYY-MM-DD'),
      DireccionOrigen: "",
      DireccionDestino: "",
      MetodoEnvio: "",
      EstadoActual: "",
      FechaEntregaEstimada: "",
      Notas: "",
      IdBodega: null,
      CostoEnvio: 0
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
            <br />
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
            <br />
            <br />
            {pedidoSeleccionado && (
              <>
                <Grid container spacing={2}>
                  {/* NUEVA DETALLE DEL PEDIDO */}
                  <Grid item xs={12} sm={6}>
                    <Card style={{ minHeight: '100%' }} >
                      <CardContent>
                        <Typography variant="h5" gutterBottom align="center" >
                          Detalle del pedido
                        </Typography>
                        {/* Contenido del detalle del pedido */}
                        <Typography variant="h6" gutterBottom align="center" >
                              Datos del cliente
                        </Typography>
                        <Grid item sx={{ width: "100%" }} style={{ marginBottom: '16px' }} >
                          <TextField
                            label="Nombres"
                            name="nombres"
                            value={pedidoSeleccionado.cliente?.nombres}
                            InputProps={{
                              readOnly: true, // Establecer como solo lectura
                            }}
                            fullWidth
                          />
                        </Grid>
                        <Grid item sx={{ width: "100%" }} style={{ marginBottom: '16px' }} >
                          <TextField
                            label="Apellidos"
                            name="apellidos"
                            value={pedidoSeleccionado.cliente?.apellidos}
                            InputProps={{
                              readOnly: true, // Establecer como solo lectura
                            }}
                            fullWidth
                          />
                        </Grid>
                          {/* Mostrar más detalles del cliente si es necesario */}
                        <Typography variant="h6" gutterBottom align="center" >
                          Productos del pedido
                        </Typography>
                        <br />
                        <Grid item sx={{ width: "100%" }} style={{ marginBottom: '16px' }} >
                          <TextField
                            label="Detalles del pedido"
                            multiline
                            rows={5}
                            value={productosPedido?.map((producto) => (
                              `Nombre: ${producto.producto?.nombre}\n` +
                              `Precio: ${producto.producto?.precio}\n` +
                              `Cantidad: ${producto.cantidad}\n\n`
                            )).join('')}
                            InputProps={{
                              readOnly: true, // Establecer como solo lectura
                            }}
                            fullWidth
                          />
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* PARTE PRODUCTOS A ENVIAR */}
                  <Grid item xs={12} sm={6}>
                    <Card style={{ minHeight: '100%' }} >
                      <CardContent>
                        <Typography variant="h5" gutterBottom align="center" >
                          Productos a enviar
                        </Typography>
                        <Autocomplete
                          options={bodegas}
                          sx={{ width: "100%" }}
                          value={bodegaSeleccionada}
                          getOptionLabel={(option) => option.nombre || "" }
                          isOptionEqualToValue={(option, value) =>  option.value === value.value}
                          onChange={(event, value) => handleSelectChangeBodega(value)}
                          onBlur={formik.handleBlur}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Bodega"
                              name="IdBodega"
                              error={
                                formik.touched.IdBodega &&
                                Boolean(formik.errors.IdBodega)
                              }
                              helperText={
                                formik.touched.IdBodega &&
                                formik.errors.IdBodega
                              }/>
                          )}
                        />
                        {/* Contenido de productos a enviar */}
                        <Typography variant="h6" gutterBottom align="center" >
                          Seleccionar productos para enviar
                        </Typography>
                        <Grid item sx={{ width: "100%" }} style={{ marginBottom: '16px' }} >
                          <List>
                            {productosPedido.map((producto) => (
                              <ListItem key={producto.producto?.id_pro}>
                                <ListItemIcon>
                                  <Checkbox
                                    checked={productosSeleccionados.some(
                                      (seleccionado) => seleccionado.producto?.id_pro === producto.producto?.id_pro
                                    )}
                                    onChange={() => handleProductoSeleccionado(producto.producto?.id_pro)}
                                  />
                                </ListItemIcon>
                                <ListItemText primary={producto.producto?.nombre} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                        {/* Mostrar los productos seleccionados */}
                        <Typography variant="h6" gutterBottom align="center" >
                          Productos seleccionados para enviar
                        </Typography>
                        <Grid item sx={{ width: "100%" }} style={{ marginBottom: '16px' }} >
                          <List>
                            {productosSeleccionados.map((producto) => (
                              <ListItem key={producto.producto?.id_pro}>
                                <ListItemText primary={'- ' + producto.producto?.nombre} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <br />
                {/* NUEVA PARTE DATOS DEL ENVÍO */}
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Card style={{ width: "100%", maxWidth: "100%" }} >
                      <CardContent>
                        <Typography variant="h5" gutterBottom align="center" >
                          Datos del envío
                        </Typography>
                        {/* Contenido del detalle del pedido */}
                        <Grid container spacing={2} justifyContent="center">
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }} >
                            <TextField
                              label="Código"
                              name="Codigo"
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
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }} >
                            <TextField
                              label="Dirección Origen"
                              name="DireccionOrigen"
                              value={formik.values.DireccionOrigen}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.DireccionOrigen &&
                                Boolean(formik.errors.DireccionOrigen)
                              }
                              helperText={
                                formik.touched.DireccionOrigen &&
                                formik.errors.DireccionOrigen
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }} >
                            <TextField
                              label="Direccion Destino"
                              name="DireccionDestino"
                              value={formik.values.DireccionDestino}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.DireccionDestino &&
                                Boolean(formik.errors.DireccionDestino)
                              }
                              helperText={
                                formik.touched.DireccionDestino &&
                                formik.errors.DireccionDestino
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }} >
                            <TextField
                              label="Método Envio"
                              name="MetodoEnvio"
                              value={formik.values.MetodoEnvio}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.MetodoEnvio &&
                                Boolean(formik.errors.MetodoEnvio)
                              }
                              helperText={
                                formik.touched.MetodoEnvio &&
                                formik.errors.MetodoEnvio
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }} >
                            <TextField
                              label="Estado Actual"
                              name="EstadoActual"
                              value={formik.values.EstadoActual}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.EstadoActual &&
                                Boolean(formik.errors.EstadoActual)
                              }
                              helperText={
                                formik.touched.EstadoActual &&
                                formik.errors.EstadoActual
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }} >
                            <TextField
                              label="Notas"
                              name="Notas"
                              value={formik.values.Notas}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.Notas &&
                                Boolean(formik.errors.Notas)
                              }
                              helperText={
                                formik.touched.Notas &&
                                formik.errors.Notas
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={6} sm={6} style={{ marginBottom: '16px' }} >
                            <TextField
                              label="Costo Envío"
                              name="CostoEnvio"
                              type="number"
                              value={formik.values.CostoEnvio}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.CostoEnvio &&
                                Boolean(formik.errors.CostoEnvio)
                              }
                              helperText={
                                formik.touched.CostoEnvio &&
                                formik.errors.CostoEnvio
                              }fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }} >
                            <TextField
                              label="Fecha de envío"
                              name="Fecha"
                              type="date"
                              value={formik.values.Fecha}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.Fecha &&
                                Boolean(formik.errors.Fecha)
                              }
                              helperText={
                                formik.touched.Fecha &&
                                formik.errors.Fecha
                              }
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }} >
                            <TextField
                              label="Fecha estimada de entrega"
                              name="FechaEntregaEstimada"
                              type="date"
                              value={formik.values.FechaEntegaEstimada}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder="Seleccione Fecha"
                              error={
                                formik.touched.FechaEntregaEstimada &&
                                Boolean(formik.errors.FechaEntregaEstimada)
                              }
                              helperText={
                                formik.touched.FechaEntregaEstimada &&
                                formik.errors.FechaEntregaEstimada
                              }
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
            <Grid container justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
                endIcon={iconSubmit}
              >
                {labelSubmit}
              </Button>
            </Grid>
          </Form>
        </Formik>
      </>
    );
  }
  