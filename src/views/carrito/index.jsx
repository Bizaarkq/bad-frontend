import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getProductos } from "../../services/envios";
import CarritoContext from "../../context/carritoContext";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

export default function Store() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const { cart, setCart } = useContext(CarritoContext);

  useEffect(() => {
    getProductos().then((res) => {
      setProductos(res);
    });
  }, []);

  const addToCart = (producto) => {
    setCart({
      items: [
        ...cart.items,
        {
          id_prod: producto.idProd,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          cantidad: 1,
        },
      ],
    });
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tienda
        </Typography>
        <Box>
          <IconButton onClick={() => navigate("/store/cart")} aria-label="cart">
            <ShoppingCartIcon />
          </IconButton>
          <Typography variant="body1">{cart.items.length} items</Typography>
        </Box>
      </Box>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {productos.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.idProd}>
            <Card key={p.idProd}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {p.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {p.descripcion}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio: {p.precio}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    onClick={() => addToCart(p)}
                    aria-label="add to cart"
                  >
                    <AddShoppingCartIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
