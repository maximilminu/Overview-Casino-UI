
import React, { useContext, useEffect, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {
  Badge,
  Button,
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
import { ApiContext } from "../context/ApiContext";
import { UserContext } from "../context/UserProvider";
import HardwareButton from "@oc/hardware-context/dist/Button";
import { HardwareContext } from "@oc/hardware-context";
import { useLayoutEffect } from "react";
import Popover from '@mui/material/Popover';
import { Container } from "@mui/system";


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
  const [thirdBadge, setThirdBadge] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
    // eslint-disable-next-line
  const [exampleArrayTicket,setExampleArrayTicket] = useState(
    {
      side: "by overview.casino",
      validityDays: 125,
      H3: "Ticket de demo",
      SH1: "Terminal",
      SH2: "de test",
      H1: "OVERVIEW.CASINO",
      BC1:"6507326042965320",
      BC2:"6507-3260-4296-5320",
      BBC1: Date.now(),
      BBC2:"08:27:36",
      BBC3:"005",
      D1: "Cincomil con ochenta y tres centavos",
      D2: "casino Alexis",
      H2: `$ ${325.0}`,
      F1:"30 dias",
      F2: "Mi.Mejor.Club",
      Number: 9876543211,
  });
  // eslint-disable-next-line
  const [deviceCon, setdeviceCon] = useState({})

  useLayoutEffect(() => {
    const removes = [];
    const removeDevice= [];
    const sts = {};
    const devs = {};
    Object.keys(Hardware.Device).forEach((name) => {
      sts[name] = false;
      devs[name] = {devConected:false,filter:{vendorId:"",productId:""}};
      removes.push(Hardware.Device[name].statusChangedListener(
        (st) => {
          setDeviceStatus((p) => ({
            ...p,
            [name]:st,
          }));
        }
      ));
      setDeviceStatus(sts);
      
      // removeDevice.push(Hardware.Device[name].diviceConcetedListener(
      //   (devConected,filter) => {
      //     setdeviceCon((p) => ({
      //       ...p,
      //       [name]:{devConected,filter,name},
      //     }));
      //   }
      // ));
      // setdeviceCon(devs);

    });
    
    return () => {
      removes.forEach(r => r());
      removeDevice.forEach(r=>r());
    }
      // eslint-disable-next-line
  },[ Hardware ]);

  const activeButtonWhenfindeDevices = ()=>{ 
    let willMounthdevice = null;
    Object.keys(deviceCon).forEach((nameDevice)=>{
      if(deviceCon[nameDevice].devConected){
        willMounthdevice = deviceCon[nameDevice]
        return
      }
    })
    return willMounthdevice
  }

  useEffect(()=>{
   const dev = activeButtonWhenfindeDevices()
    if(dev){
      setAnchorEl(dev)
      return
    }
    setAnchorEl(null)
      // eslint-disable-next-line
  },[deviceCon])

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

  useEffect(() => {
    setThirdBadge(Hardware.warning());
    // eslint-disable-next-line
  }, [Hardware.warning()]);

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
  // eslint-disable-next-line
  const onEmpty = (to) => {
    navigate(routes.path);
  };

  const handleClose = () => {
    handleLogout();
    window.close();
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const openPopOver = Boolean(anchorEl);

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
        <Box sx={{display:"flex", gap:"15px"}}>
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
                  

        <div style={{position:"relative"}}>
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
              invisible={true}
              badgeContent={primaryBadge}
            >
              <Badge
                anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              overlap="circular"
              color="warning"
              invisible={thirdBadge === false}
              badgeContent={thirdBadge}
              >
            <div>
              <Tooltip title="Mis opciones">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, marginLeft: "2px" }}
                >
                  <Avatar subject={userProfile} />
                </IconButton>
              </Tooltip>

                <Popover
                id={"simple-popover"}
                sx={{marginTop:"40px"}}
                open={openPopOver}
                anchorEl={anchorEl}
                onClose={handleClosePopOver}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              
            >
              <Container>
              <Typography sx={{ p: 2 }}>Se ha Conectado '{activeButtonWhenfindeDevices() && activeButtonWhenfindeDevices().name}'</Typography>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <Button
                  color="success"
                  disabled={!(activeButtonWhenfindeDevices() && activeButtonWhenfindeDevices().devConected)} 
                  onClick={()=>Hardware.Device["TclPrinter"].connect(activeButtonWhenfindeDevices().filter)}>
                    Conectar
                </Button>
              </div>
              </Container>
            </Popover>
          </div>
      
                
              </Badge>


              
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
                          Hardware.Device[name].connect(Hardware.Configs.Peripherals[name].Filter)
                            .then(() => {
                              if (Hardware.Device[name].status()) {
                                setDeviceStatus((p) => ({...p,[Hardware.Configs.Peripherals[name].Driver]:Hardware.Device[name].status()}));
                              }
                            });
                        }
                        else{
                          if( Hardware.Device && Hardware.Device.TclPrinter) {
                            Hardware.Device[name].print(exampleArrayTicket)
                          }
                          if(Hardware.Device && Hardware.Device.Printer){
                            Hardware.Device[name].demo()
                          }
                        }
                      }}
                      driver={Hardware.Configs.Peripherals[name].Driver}
                      sxTypography={{ color: "white", marginTop: "-5px" }}
                      sxIcon={{ fontSize: "x-small" }}
                      status={ deviceStatus[name] }
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
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;