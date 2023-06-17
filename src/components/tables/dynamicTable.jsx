import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Button,
    IconButton,
    Icon,
  } from "@mui/material";
  import { Visibility, Edit } from "@mui/icons-material";
  import { useState } from "react";
  import { Link } from "react-router-dom";
  
  export default function DynamicTable({
    columns,
    rows,
    actions,
    rowsPerPage,
    setRowsPerPage,
    totalRows,
  }) {
    const [page, setPage] = useState(0);
  
    return (
      <>
        <Paper sx={{ width: "100%", height:"100%" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
  
                  {actions && actions.length > 0 && (
                    <TableCell
                      key="actions"
                      align="center"
                      sx={{ minWidth: 100 }}
                    >
                      Acciones
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={index}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                        {actions && actions.length > 0 && (
                          <TableCell key="actions" align="center">
                            {actions.map((action, index) => {
                              return (
                                <Link to={action.path + '/' + action.accion + '/' + row.id} key={index}>
                                  <IconButton
                                    key={index}
                                    color={action.color}
                                    size="small"
                                  >
                                    <Icon>{action.icon}</Icon>
                                  </IconButton>
                                </Link>
                                
                              );
                            })}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => {
              setPage(newPage);
            }}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>
      </>
    );
  }
  