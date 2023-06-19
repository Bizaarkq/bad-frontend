import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Card,
  CardContent,
  Box
} from '@mui/material';
import SaveIcon from "@mui/icons-material/Save";
import EnvioService from '../../services/envios';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';

const actions = [];

const validationSchema = Yup.object().shape({
  idEnv: Yup.number().required('Campo requerido'),
  estadoActual: Yup.string().required('Campo requerido'),
  estadoPrevio: Yup.string().required('Campo requerido'),
  ubicacionActual: Yup.string().required('Campo requerido'),
  descripcion: Yup.string().required('Campo requerido'),
  notas: Yup.string(),
  responsable: Yup.string().required('Campo requerido'),
  nivelUrgencia: Yup.string().required('Campo requerido'),
});

const initialValues = {
    idEnv: null,
    estadoActual: "",
    estadoPrevio: "",
    ubicacionActual: "",
    descripcion: "",
    notas: "",
    responsable: "",
    nivelUrgencia: "",
  };

export default function ListEnvios() {
  const [envios, setEnvios] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);
  const [envioSeleccionado, setEnvioSeleccionado] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [idEnvSeleccionado, setIdEnvSeleccionado] = useState(null);

  const fetchEnvios = async () => {
    try {
      const response = await EnvioService.getAll();
      console.log(response);
      setEnvios(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEnvios();
  }, []);

  const handleAgregarSeguimiento = () => {
    setMostrarFormulario(true);
  };

  const handleSelectChange = async (value) => {
    console.log(value)
    setEnvioSeleccionado(value);
    setIdEnvSeleccionado(value ? value.id_envio : null);
    if (value) {
      try {
        const seguimiento = await EnvioService.getSeguimientosXEnvio(value.id_envio);
        console.log(seguimiento)
        setSeguimientos(seguimiento);
      } catch (error) {
        console.log(error);
      }
    } else {
      setSeguimientos(null);
    }
  };

  const handleSubmit = async (values, formik) => {
    // formik.setFieldValue("IdEnv", envioSeleccionado.id_envio );

    console.log(values)
    console.log(envioSeleccionado.id_envio)

    try {
        const seguimiento = await EnvioService.createSeguimiento(values);
        console.log(seguimiento)
        if (seguimiento) {
            setMostrarFormulario(false)
            handleSelectChange(envioSeleccionado)
        }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Grid
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          height: '100%',
        }}
      >
        <Grid item sx={{ width: '100%' }} style={{ marginBottom: '16px' }}>
          <Typography variant="h4" gutterBottom>
            Seguimiento de envíos
          </Typography>
          <br />
          <Typography variant="h6" gutterBottom>
            Seleccione un envio
          </Typography>
          <Autocomplete
            options={envios}
            sx={{ width: '100%' }}
            value={envioSeleccionado}
            getOptionLabel={(option) => option.codigo || ''}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onChange={(event, value) => handleSelectChange(value)}
            renderInput={(params) => <TextField {...params} label="Envio" name="envio" />}
          />
          <br />
          {envioSeleccionado && (
            <>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAgregarSeguimiento}>
                Agregar Seguimiento
            </Button>
              <br />
            {/* Agregar el formulario de seguimiento */}
              {mostrarFormulario && (
                <Formik
                    initialValues={{
                        ...initialValues,
                        idEnv: idEnvSeleccionado,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {( formik) => (
                    <Form>
                        <br />
                        <Typography variant="h6" gutterBottom>
                        Nuevo seguimiento
                        </Typography>
                        <br />
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Estado actual"
                                    name="estadoActual"
                                    value={formik.values.estadoActual}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.estadoActual &&
                                        Boolean(formik.errors.estadoActual)
                                    }
                                    helperText={
                                        formik.touched.estadoActual &&
                                        formik.errors.estadoActual
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Estado previo"
                                    name="estadoPrevio"
                                    value={formik.values.estadoPrevio}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.estadoPrevio &&
                                        Boolean(formik.errors.estadoPrevio)
                                    }
                                    helperText={
                                        formik.touched.estadoPrevio &&
                                        formik.errors.estadoPrevio
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Ubicación actual"
                                    name="ubicacionActual"
                                    value={formik.values.ubicacionActual}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.ubicacionActual &&
                                        Boolean(formik.errors.ubicacionActual)
                                    }
                                    helperText={
                                        formik.touched.ubicacionActual &&
                                        formik.errors.ubicacionActual
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Descripción"
                                    name="descripcion"
                                    value={formik.values.descripcion}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.descripcion &&
                                        Boolean(formik.errors.descripcion)
                                    }
                                    helperText={
                                        formik.touched.descripcion &&
                                        formik.errors.descripcion
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Notas"
                                    name="notas"
                                    value={formik.values.notas}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.notas &&
                                        Boolean(formik.errors.notas)
                                    }
                                    helperText={
                                        formik.touched.notas &&
                                        formik.errors.notas
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Responsable"
                                    name="responsable"
                                    value={formik.values.responsable}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.responsable &&
                                        Boolean(formik.errors.responsable)
                                    }
                                    helperText={
                                        formik.touched.responsable &&
                                        formik.errors.responsable
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                                <TextField
                                    label="Nivel urgencia"
                                    name="nivelUrgencia"
                                    value={formik.values.nivelUrgencia}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.nivelUrgencia &&
                                        Boolean(formik.errors.nivelUrgencia)
                                    }
                                    helperText={
                                        formik.touched.nivelUrgencia &&
                                        formik.errors.nivelUrgencia
                                    }
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <br />
                        {/* Botones de envío y cancelación */}
                        <Box sx={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#1976D2", color: "white" }}
                                startIcon={<SaveIcon />}
                                disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
                                onClick={() => handleSubmit(formik.values, formik)}
                            >
                                Agregar Seguimiento
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setMostrarFormulario(false)}
                                sx={{ backgroundColor: "red", color: "white" }}
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </Form>
                    )}
                </Formik>
              )}
              <br />
              <Grid container spacing={2}>
                {/* COMENZAMOS EL LOOP */}
                {seguimientos.map((seguimiento) => (
                  <Grid item xs={12} sm={6} key={seguimiento.idSeg}>
                    <Card style={{ width: '100%', maxWidth: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom align="center">
                          Datos del seguimiento
                        </Typography>
                        <br />
                        <Grid container spacing={2} justifyContent="center">
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                            <TextField
                              label="Estado"
                              name="estado_actual"
                              value={seguimiento.estadoActual}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                            <TextField
                              label="Estado previo"
                              name="estado_previo"
                              value={seguimiento.estadoPrevio}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                            <TextField
                              label="Fecha"
                              name="fecha"
                              value={seguimiento.fechaHoraUpdate}
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                            <TextField
                              label="Ubicación"
                              name="ubicacion_actual"
                              value={seguimiento.ubicacionActual}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                            <TextField
                              label="Descripción"
                              name="descripcion"
                              value={seguimiento.descripcion}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                            <TextField
                              label="Notas"
                              name="notas"
                              value={seguimiento.notas}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{ marginBottom: '16px' }}>
                            <TextField
                              label="Responsable"
                              name="responsable"
                              value={seguimiento.responsable}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={6} sm={6} style={{ marginBottom: '16px' }}>
                            <TextField
                              label="Nivel urgencia"
                              name="nivel_urgencia"
                              value={seguimiento.nivelUrgencia}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}
