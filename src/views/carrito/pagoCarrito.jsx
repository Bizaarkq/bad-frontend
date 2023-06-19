import { useState, useContext, useEffect } from "react";
import { useCart } from "../../context/carritoContext";
import { useAuth } from "../../context/userContext";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

const pagoSchema = Yup.object().shape({
  metodo: Yup.string().required("Campo requerido"),
  descripcion: Yup.string().required("Campo requerido"),
  num_referencia: Yup.string().required("Campo requerido"),
  colector: Yup.string().required("Campo requerido"),
});

export default function PagoCarrito() {
  const { cart, setCart } = useCart();
  const { user, setUser } = useAuth();
  const [items, setItems] = useState([]);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    let total = 0;

    //ordenando carrito
    const items = cart.items.reduce((acc, item) => {
      const found = acc.find((i) => i.id_prod === item.id_prod);
      if (found) {
        found.cantidad += 1;
      } else {
        acc.push({
          id_prod: item.id_prod,
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio,
          cantidad: 1,
        });
      }
      return acc;
    }, []);

    setItems(items);

    //calculando total
    items.forEach((item) => {
      total += item.precio * item.cantidad;
    });

    setTotal(total);
  }, [cart]);

  const handlePago = (values) => {
    console.log(values);
    setCart({ items: [] });
  };
  console.log("cart", cart.items);
  return (
    <>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Productos
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {items.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id_prod}>
              <Card key={p.id_prod}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {p.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.descripcion}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    precio: {p.precio}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    cantidad: {p.cantidad}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Pago
        </Typography>
        <Typography variant="h5" component="h1" gutterBottom>
          Total: {total}
        </Typography>
        <Formik
          initialValues={{
            metodo: "",
            descripcion: "",
            num_referencia: "",
            colector: "",
          }}
          validationSchema={pagoSchema}
          onSubmit={(values) => {
            handlePago(values);
          }}
        >
          {({
            errors,
            touched,
            values,
            handleBlur,
            handleChange,
            isSubmitting,
            dirty,
            isValid,
          }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="monto"
                    name="monto"
                    disabled={true}
                    value={total}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="metodo"
                    name="metodo"
                    label="Metodo"
                    value={values.metodo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.metodo && Boolean(errors.metodo)}
                    helperText={touched.metodo && errors.metodo}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="descripcion"
                    name="descripcion"
                    label="Descripcion"
                    value={values.descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.descripcion && Boolean(errors.descripcion)}
                    helperText={touched.descripcion && errors.descripcion}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="num_referencia"
                    name="num_referencia"
                    label="Numero de referencia"
                    value={values.num_referencia}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.num_referencia && Boolean(errors.num_referencia)
                    }
                    helperText={touched.num_referencia && errors.num_referencia}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="colector"
                    name="colector"
                    label="Colector"
                    value={values.colector}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.colector && Boolean(errors.colector)}
                    helperText={touched.colector && errors.colector}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || !dirty || !isValid}
                  >
                    Pagar
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
}
