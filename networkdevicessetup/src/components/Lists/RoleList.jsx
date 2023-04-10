import * as React from "react";
import EditRoleModal from "../Modals/EditRoleModal";
import {
  Paper,
  Container,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Box,
  styled,
  tableCellClasses,
} from "@mui/material";
import AddRoleModal from "../Modals/AddRoleModal";

function createData(name, quantity) {
  return { name, quantity };
}

const style = {
  tableCell: {
    fontWeight: "700",
    color: "rgb(123, 128, 154)",
    textTransform: "uppercase",
  },
  tableCellTitle: {
    fontWeight: "700",
    color: "white",
    height: "55px",
    textTransform: "uppercase",
    textAlign: "center",
    backgroundColor: "primary.main",
  },
  paper: {
    margin: "0 auto",
    flexDirection: "column",
    backgroundClip: "border-box",
    width: "80%",
    backgroundColor: "rgb(255, 255, 255)",
    boxShadow: "rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem",
  },
};

const rol = [
  createData("Terminal de Cajas", 50),
  createData("CPU", 40),
  createData("Terminal de Autogestión", 33),
  createData("Cajero Automático", 0),
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    height: "50px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const RoleList = () => {
  const [roles, setRoles] = React.useState();
  // eslint-disable-next-line
  const [open, setOpen] = React.useState(true);

  React.useLayoutEffect(() => {
    setRoles(rol);
    setOpen(false);
  }, []);

  return (
    <>
      {/* <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer - 100,
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}

      <Container sx={{ marginTop: "50px", marginBottom: "50px" }}>
        <TableContainer
          sx={{ maxHeight: { xl: 620, lg: 500, md: 400 } }}
          component={Paper}
        >
          <Table
            stickyHeader
            aria-label="sticky table"
            size="small"
            sx={{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
              },
              overflow: "auto",
              maxHeight: { xl: 620, lg: 500, md: 400 },
            }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell
                  align="center"
                  sx={style.tableCellTitle}
                  colSpan={6}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      marginBottom: "-25px",
                    }}
                  >
                    <AddRoleModal />
                  </Box>
                  Roles Registrados
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow sx={{ height: "50px" }}>
                <TableCell align="left" sx={style.tableCell}>
                  Rol
                </TableCell>
                <TableCell align="right" sx={style.tableCell}>
                  Modificar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles?.map((rol) => (
                <StyledTableRow
                  key={rol.name}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                    padding: "12px 24px",
                  }}
                >
                  <TableCell align="left" component="th" scope="rol">
                    {rol.name}
                  </TableCell>
                  <TableCell align="right" component="th" scope="rol">
                    <EditRoleModal singleRole={rol} />
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default RoleList;
