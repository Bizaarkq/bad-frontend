import { Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function authLayout() {
    return (
        <>
            <Paper sx={{ marginTop: 8, padding: 8 }}>
                <Outlet />
            </Paper>
        </>
    );
}