import React from "react";
import { Box } from "@mui/system";
import { Button } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const mockData = [
  { key: "Estado", data: "Pagado" },
  { key: "Tipo", data: "Ticket" },
  { key: "Maq generadora", data: "22300142" },
  { key: "Maq acredito", data: "-" },
  { key: "Usuario pago", data: "MAGDANELA CERRANO" },
  { key: "Usuario Habilito", data: "-" },
  { key: "Usuario Autorizo", data: "-" },
  { key: "Caja pago", data: "Caja central 8" },
  { key: "Usuario Imprimio", data: "-" },
  { key: "Caja Imprimio", data: "-" },
  { key: "Fch. Impresion maq", data: "04-12-2022 11:25:35" },
  { key: "Fch Impresion svr", data: "04-12-2022 11:25:49" },
  { key: "Fch Pago", data: "04-12-2022 11:26:33" },
  { key: "Importe", data: "$1245.58" },
  { key: "Ley 15.079", data: "$0.00" },
];

const rowModify = (key, data) => {
  return (
    <TableRow>
      <TableCell align="left">{key}</TableCell>
      <TableCell align="center">{data}</TableCell>
    </TableRow>
  );
};

const CardInfo = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          marginTop: "40px",
        }}
      >
        <TableContainer sx={{ width: 500 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="right">Ticket #004827199148785793</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {mockData.map(e =>(
                rowModify(e.key,e.data))
              )} */}

              <TableRow>
                <TableCell align="left"></TableCell>
                <TableCell align="center">
                  <Button>Continuar</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default CardInfo;
