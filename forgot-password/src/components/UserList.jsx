import * as React from "react";
import {
  Container,
  Backdrop,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  CircularProgress,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Link } from "react-router-dom";
import UserPagination from "./UserPagination";

const style = {
  tableCell: {
    fontWeight: "700",
    color: "rgb(123, 128, 154)",
    textTransform: "uppercase",
    textAlign: "left",
  },
};

export default function UserList({ goToUserCard, users, open }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage] = React.useState(5);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = users?.slice(firstPostIndex, lastPostIndex);

  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: 0,
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container sx={{ marginBottom: "50px", width: "70%" }}>
        <TableContainer
          component={Paper}
          sx={{ padding: "20px", marginBottom: "100px" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={style.tableCell}>Nombre</TableCell>
                <TableCell sx={style.tableCell}>Legajo</TableCell>
                <TableCell sx={style.tableCell}>Dni</TableCell>
                <TableCell sx={style.tableCell}>Rol</TableCell>
                <TableCell sx={style.tableCell}>Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPosts?.map((singleUser) => (
                <TableRow
                  key={singleUser.firstName}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" component="th" scope="row">
                    {singleUser.firstName} {singleUser.lastName}
                  </TableCell>
                  <TableCell align="left" component="th" scope="row">
                    {singleUser.legajo}
                  </TableCell>
                  <TableCell align="left" component="th" scope="row">
                    {singleUser.DNI}
                  </TableCell>
                  <TableCell align="left">{singleUser.role}</TableCell>
                  <TableCell align="left">
                    <Link
                      to={`/user-admin/user-details/${singleUser.id}`}
                      style={{ textDecoration: "none", color: "#d03c31" }}
                    >
                      <AddCircleIcon onClick={goToUserCard} size="small" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <UserPagination
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPosts={users?.length}
          />
        </TableContainer>
      </Container>
    </>
  );
}
