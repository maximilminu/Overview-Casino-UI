import * as React from "react";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import Logo from "../assests/logo.jpg";

import { Tooltip } from "@mui/material";
import fakeListUser from "../mock-data.json";
import { Print } from "@mui/icons-material";
import {
  PrinterContext,
  PRINTER_STATUS_OFFLINE,
} from "../context/EscPosPrinterContext";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: "90px",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "15px",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,

    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "30vw",
      "&:focus": {
        width: "30vw",
      },
    },
  },
}));

export default function SearchAppBar({
  backToHome,
  goToList,
  setUsers,
  users,
}) {
  const handleSearchChange = (e) => {
    if (!e.target.value) return setUsers(fakeListUser);
    const value = e.target.value.toLowerCase();
    const filterUsers = users?.filter(
      (user) =>
        user.firstName.toLowerCase().includes(value) ||
        user.lastName.toLowerCase().includes(value) ||
        user.legajo.toLowerCase().includes(value) ||
        user.role.toLowerCase().includes(value) ||
        user.DNI.includes(value) ||
        user.legajo.includes(value) ||
        user.contactNumber.includes(value)
    );
    setUsers(filterUsers);
    setTimeout(() => {
      e.target.value = "";
      setUsers(fakeListUser);
    }, 4000);
  };
  const { Printer } = React.useContext(PrinterContext);
  return (
    <>
      {" "}
      <AppBar
        position="static"
        sx={{
          marginBottom: "80px",
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ height: "7vh", backgroundColor: "black" }}>
          <Link to="/user-admin">
            <Box
              component="img"
              src={Logo}
              sx={{ width: "100px", height: "60px" }}
            />
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={handleSearchChange}
              placeholder="Buscar…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Tooltip title="Lista de Usuarios" arrow placement="bottom">
              <Link
                to="/user-admin/user-list-information"
                style={{ textDecoration: "none", color: "white" }}
              >
                <IconButton
                  onClick={goToList}
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <SupervisedUserCircleIcon sx={{ marginRight: "15px" }} />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Impresora" arrow placement="bottom">
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                sx={{ flexDirection: "column", color: "white" }}
                onClick={() => {
                  if (Printer.status === PRINTER_STATUS_OFFLINE) {
                    Printer.connect();
                  }
                }}
              >
                <Print
                  sx={{
                    fill:
                      Printer.status === PRINTER_STATUS_OFFLINE
                        ? "red"
                        : "green",
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
