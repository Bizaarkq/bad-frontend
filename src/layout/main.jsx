import Menu from "../components/menu";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Menu />
      <Box sx={{ marginTop: 8, padding: 4 }}>
        <Outlet />
      </Box>
    </>
  );
}
