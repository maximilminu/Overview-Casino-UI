import React, { useContext, useEffect, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {
  Badge,
  ButtonGroup,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material";
import { UNSAFE_RouteContext, useNavigate, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { ApiContext } from "@oc/api-context";
import { UserContext } from "@oc/user-context";
import HardwareButton from "@oc/hardware-context/dist/Button";
import { HardwareContext } from "@oc/hardware-context";

const Navbar = (props) => {
  const theme = useTheme();
  // eslint-disable-next-line
  const [deviceStatus, setDeviceStatus] = useState({});
  // eslint-disable-next-line
  const { param } = useParams();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const userProfile = useContext(UserContext);
  const { Logout } = useContext(ApiContext);
  const ref = useRef(false);
  const routeContext = useContext(UNSAFE_RouteContext);
  const routes = routeContext.matches[0].route;
  const Hardware = useContext(HardwareContext);
  // eslint-disable-next-line
  const [primaryBadge, setPrimaryBadge] = useState(false);
  const [secondaryBadge, setSecondaryBadge] = useState(false);

  useEffect(() => {
    if (props.onHeightChange) {
      props.onHeightChange(ref.current.offsetHeight);
    }
    // eslint-disable-next-line
  }, [ref]);

  useEffect(() => {
    setSecondaryBadge(Hardware.errors());
    // eslint-disable-next-line
  }, [Hardware.errors()]);

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

  const handleClose = () => {
    handleLogout();
    window.close();
  };

  return (
    <AppBar
      sx={{
        position: "fixed",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      ref={ref}
    >
      <Toolbar
        sx={{
          zIndex: theme.zIndex.drawer + 100,
          backgroundColor: "#1c1c1d",
        }}
      >
        <Box sx={{ display: "flex", gap: "15px" }}>
          {routes.children.map((route) => {
            let url = route.path;
            route.handle.defaultParams &&
              Object.keys(route.handle.defaultParams).forEach((e) => {
                url = url.replace(":" + e, route.handle.defaultParams[e]);
              });
            return (
              <Tooltip
                key={route.path}
                TransitionComponent={Zoom}
                arrow
                title={route.handle.breadCrumsCaption}
              >
                <IconButton
                  onClick={() => navigate(url)}
                  disabled={props.disable}
                  sx={{ color: "white" }}
                >
                  {route.handle.icon}
                </IconButton>
              </Tooltip>
            );
          })}
        </Box>
        <Box sx={{ flexGrow: 2.5 }} />

        <Box sx={{ flexGrow: 2.5 }} />
        {typeof props.counter === "number" && (
          <Avatar sx={{ marginX: 3, backgroundColor: "success.light" }}>
            {props.counter}
          </Avatar>
        )}
        <ButtonGroup color="inherit">
          <Badge
            invisible={secondaryBadge === false}
            badgeContent={secondaryBadge}
            overlap="circular"
            color="error"
          >
            <Badge
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              overlap="circular"
              color="success"
              invisible={primaryBadge === false}
              badgeContent={primaryBadge}
            >
              <Tooltip title="Mis opciones">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, marginLeft: "2px" }}
                >
                  <Avatar subject={userProfile} />
                </IconButton>
              </Tooltip>
            </Badge>
          </Badge>
          <Menu
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
            <MenuItem
              disableRipple={true}
              sx={{
                padding: 0,
                marign: 0,
                display: "flex",
                justifyContent: "center",
                "&:hover": {
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            >
              {Object.keys(Hardware.Configs.Peripherals).map((name, idx) => {
                if (
                  Hardware.Device[name] &&
                  Hardware.Configs.Peripherals[name]
                ) {
                  return (
                    <HardwareButton
                      key={name}
                      name={name}
                      onClick={(e) => {
                        if (!Hardware.Device[name].status()) {
                          Hardware.Device[name]
                            .connect(Hardware.Configs.Peripherals[name].Filter)
                            .then(() => {
                              if (Hardware.Device[name].status()) {
                                setDeviceStatus((p) => ({
                                  ...p,
                                  [Hardware.Configs.Peripherals[name].Driver]:
                                    Hardware.Device[name].status(),
                                }));
                                Hardware.Device[name].statusChangedListener(
                                  () => {
                                    setDeviceStatus((p) => ({
                                      ...p,
                                      [Hardware.Configs.Peripherals[name]]:
                                        Hardware.Device[name].status(),
                                    }));
                                  }
                                );
                              }
                            });
                        }
                      }}
                      driver={Hardware.Configs.Peripherals[name].Driver}
                      sxTypography={{ color: "white", marginTop: "-5px" }}
                      sxIcon={{ fontSize: "x-small" }}
                      status={
                        Hardware.Device[name].name() === "Sin Conexion."
                          ? false
                          : Hardware.Device[name].status()
                      }
                    />
                  );
                } else {
                  return false;
                }
              })}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Cerrar sesión</Typography>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Typography textAlign="center">Cerrar máquina</Typography>
            </MenuItem>
          </Menu>
        </ButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
