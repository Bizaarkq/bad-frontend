import EnvioService from "../../services/envios";
import DynamicTable from "../../components/tables/dynamicTable";
import { useState, useEffect } from "react";
import { Grid, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import moment from "moment";

const columns = [
  { id: "codigo", label: "Código", minWidth: 80 },
  { id: "direccion_origen", label: "Dirección Origen", minWidth: 100 },
  { id: "direccion_destino", label: "Dirección Destino", minWidth: 100 },
  { id: "estado_actual", label: "Estado", minWidth: 80 },
  { id: "fecha_entrega_estimada", label: "Fecha entrega estimada", minWidth: 150 },
];

const actions = [];

export default function ListEnvios() {
  const [indemnizaciones, setEnvios] = useState([]);

  useEffect(() => {
    retrieveEnvios();
  }, []);

  const retrieveEnvios = () => {
    EnvioService.getAll()
      .then((response) => {
        setEnvios(
          response.map((envio) => {
            return {
              id: envio.id,
              direccion_origen: envio.direccion_origen,
              direccion_destino: envio.direccion_destino,
              estado_actual: envio.estado_actual,
              fecha_entrega_estimada: envio.fecha_entrega_estimada? moment(envio.fecha_entrega_estimada).format('YYYY-MM-DD') : '-',
            };
          })
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          height: "100%",
        }}
      >
        <Typography variant="h5" gutterBottom>
            Envíos
        </Typography>
        
        <Link to="/logistica/nuevo-envio">
        <Button variant="contained" color="primary" startIcon={<AddIcon/>}>
          Agregar Envío
        </Button>
        </Link>
        
      </Grid>

      <DynamicTable
        columns={columns}
        rows={indemnizaciones}
        actions={actions}
        page={0}
        setPage={0}
        rowsPerPage={10}
        setRowsPerPage={10}
        totalRows={indemnizaciones.length}
      />
    </>
  );
}
