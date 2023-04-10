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
import { ApiContext } from "@oc/api-context";
import { UserContext } from "@oc/user-context";
import styled from "@emotion/styled";
import packageJson from "../../package.json";
import { ConfigContext } from "@oc/config-context";
import { useRef } from "react";
import { useEffect } from "react";

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

const Navbar = (props) => {
  const config = React.useContext(ConfigContext);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { Logout } = React.useContext(ApiContext);
  const theme = useTheme();
  const userProfile = React.useContext(UserContext);
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const ref = useRef(false);

  useEffect(() => {
    if (props.onHeightChange) {
      props.onHeightChange(ref.current.offsetHeight);
    }
    // eslint-disable-next-line
  }, [ref]);

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
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      ref={ref}
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
