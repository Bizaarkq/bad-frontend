import React, { useState, useEffect } from "react";
import {
  AppBar,
  Button,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Icon from "@mui/material/Icon";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
//import { MENU } from "../../services/constantes";
import {menu, lateral} from '../../services/constantes';
import { useAuth } from "../../context/userContext";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useAuth();

  const menuAbierto = () => {
    setOpen(!open);
  };

  console.log("Menu.jsx: user: ", user);
  const {prev, inicio} = user.roles.includes("cliente") 
    ? { prev: menu.cliente, inicio: "/store" }
    : user.roles.includes("logistica")
      ? {prev: menu.logistica, inicio: "/logistica"}
      : user.roles.includes("transporte")
        ? { prev: menu.transporte, inicio: "/transporte" }
        : [];
  
  const MENU = [{
    name: "Inicio",
    path: inicio,
    icon: "home"
  }].concat(prev);

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={menuAbierto}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component={Link} to={inicio} variant="h6" sx={{ flexGrow: 1, textDecoration: "none", color: "white" }}>
            Amazon Services
          </Typography>
        </Toolbar>
        <Drawer anchor="left" open={open} onClose={menuAbierto}>
          <Box sx={{ marginLeft: "auto" }}>
            <IconButton onClick={menuAbierto}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <Divider />
            {MENU.map((item, key) => {
              return (
                <>
                  <ListItemButton key={key} component={Link} to={item.path}>
                    <ListItemIcon>
                      <Icon>{item.icon}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                  <Divider />
                </>
              );
            })}
          </List>
        </Drawer>
      </AppBar>
    </>
  );
}
