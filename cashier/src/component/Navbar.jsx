import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "./Avatar";
import {
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  tooltipClasses,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
} from "@mui/material";
import BarcodeReaderButton from "./Button/BarcodeReaderButton";
import TclPrinterButton from "./Button/TclPrinterButton";
import EscPosPrinterButton from "./Button/EscPosPrinterButton";
import { ApiContext } from "../context/ApiContext";
import { UserContext } from "../context/UserProvider";
import styled from "@emotion/styled";
import packageJson from "../../package.json";
import { ConfigContext } from "../context/ConfigProvider";

// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },

//   marginLeft: "20px",
//   width: "100%",
//   [theme.breakpoints.up("sm")]: {
//     marginLeft: theme.spacing(1),
//     width: "auto",
//   },
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   marginRight: "15px",
// }));

// const StyledTextField = styled(TextField)(({ theme }) => ({
//   color: "inherit",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,

//     transition: theme.transitions.create("width"),
//     width: "100%",
//     [theme.breakpoints.up("sm")]: {
//       width: "30vw",
//       "&:focus": {
//         width: "30vw",
//       },
//     },
//   },

//   "&	.MuiOutlinedInput-root": { color: "inherit" },
// }));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "red",
    fontWeight: 700,
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: "20px",
    border: "1px solid #dadde9",
  },
}));

const Navbar = ({ buttonsRef }) => {
  const config = React.useContext(ConfigContext);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { Logout } = React.useContext(ApiContext);
  const theme = useTheme();
  const userProfile = React.useContext(UserContext);
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    Logout();
  };

  return (
    <AppBar
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "black",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ height: "7vh", backgroundColor: "#1c1c1d" }}>
        {packageJson.version.includes("rc") ? (
          <HtmlTooltip
            TransitionComponent={Zoom}
            title={`v${packageJson.version}`}
          >
            <Box
              component="img"
              src={config.Images.LogoHeader}
              sx={{
                objectFit: "contain",
                width: down600px ? "90px" : "160px",
                height: down600px ? "40px" : "46px",
              }}
            />
          </HtmlTooltip>
        ) : (
          <Tooltip TransitionComponent={Zoom} title={`v${packageJson.version}`}>
            <Box
              component="img"
              src={config.Images.LogoHeader}
              sx={{
                objectFit: "contain",
                width: down600px ? "90px" : "160px",
                height: down600px ? "40px" : "46px",
              }}
            />
          </Tooltip>
        )}
        {down600px ? (
          <>
            <Button sx={{ marginInlineStart: "auto" }} onClick={handleClick}>
              <Avatar subject={userProfile} />
            </Button>
            <Menu
              sx={{
                ".MuiMenu-list": {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                },
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem>
                <BarcodeReaderButton />
              </MenuItem>
              <MenuItem>
                <TclPrinterButton />
              </MenuItem>
              <MenuItem>
                <EscPosPrinterButton />
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Cerrar sesión</Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <ButtonGroup
            sx={{
              marginInlineStart: "auto",
              alignItems: "center",
              marginRight: "5px",
            }}
            color="inherit"
          >
            <BarcodeReaderButton />
            <TclPrinterButton />
            <EscPosPrinterButton />
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Mis opciones">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, marginBottom: "5px", marginLeft: "2px" }}
                >
                  <Avatar subject={userProfile} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">
                    Cerrar temporalmente
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </ButtonGroup>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
