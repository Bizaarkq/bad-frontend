import { Paper, Typography, Alert, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import FormularioEnvio from "../../components/forms/envio-form";
import EnvioService from "../../services/envios";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";

export default function NuevoEnvio() {
  const navigate = useNavigate();
  const [updated, setUpdated] = useState(false);
  const [failed, setFailed] = useState(false);

  const createEnvio = useCallback(async (values) => {
    const response = await EnvioService.create(values);
    if (response.ok) {
      setUpdated(true);
      navigate("/transport/index");
    }else{
      setFailed(true);
    }
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setUpdated(false);
  };

  return (
    <>
      <Paper
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Nuevo Envío
        </Typography>
        <FormularioEnvio
          onSubmit={createEnvio}
          labelSubmit="Crear"
          iconSubmit={<SaveIcon />}
        />
        <Snackbar open={updated} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Envío creado con éxito
          </Alert>
        </Snackbar>
        <Snackbar open={failed} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            Error al crear
          </Alert>
        </Snackbar>
      </Paper>
    </>
  );
}
