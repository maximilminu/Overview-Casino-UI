import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {
  Menu,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
  useMediaQuery,
  useTheme,
  Zoom,
  IconButton,
  Typography,
} from "@mui/material";
import packageJson from "../../package.json";
import { ConfigContext } from "@oc/config-context";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import Avatar from "./Avatar";
import { ApiContext } from "@oc/api-context";
import { Link } from "react-router-dom";
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
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const config = useContext(ConfigContext);
  const theme = useTheme();
  const userProfile = useContext(UserContext);
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { Logout } = useContext(ApiContext);
  const ref = useRef(false);

  useEffect(() => {
    if (props.onHeightChange) {
      props.onHeightChange(ref.current.offsetHeight);
    }
    // eslint-disable-next-line
  }, [ref]);

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
      <Toolbar
        sx={{
          zIndex: theme.zIndex.drawer + 100,

          backgroundColor: "#1c1c1d",
        }}
      >
        {packageJson.version.includes("rc") ? (
          <HtmlTooltip
            TransitionComponent={Zoom}
            title={`v${packageJson.version}`}
          >
            <Link to="/network-devices">
              <Box
                component="img"
                src={config.Images.LogoHeader}
                sx={{
                  objectFit: "contain",
                  width: down600px ? "90px" : "160px",
                  height: down600px ? "40px" : "46px",
                }}
              />
            </Link>
          </HtmlTooltip>
        ) : (
          <Tooltip TransitionComponent={Zoom} title={`v${packageJson.version}`}>
            <Link to="/network-devices">
              <Box
                component="img"
                src={config.Images.LogoHeader}
                sx={{
                  objectFit: "contain",
                  width: down600px ? "90px" : "160px",
                  height: down600px ? "40px" : "46px",
                }}
              />
            </Link>
          </Tooltip>
        )}
        {down600px ? (
          <>
            <Box sx={{ flexGrow: 1 }} />
            {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledTextField
                autoComplete="off"
                value={ticketNumber}
                onChange={handleTicketNumberChange}
                placeholder="Buscar…"
                InputProps={{
                  "aria-label": "search",
                  endAdornment: (
                    <InputAdornment position="end">
                      {ticketNumber?.length > 1 && (
                        <IconButton onClick={handleTicketNumberClean}>
                          <Cancel />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                autoFocus={true}
              />
            </Search> */}
            <Tooltip title="Mis opciones">
              <IconButton
                sx={{ marginInlineStart: "auto" }}
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                }}
              >
                <Avatar subject={userProfile} />
              </IconButton>
            </Tooltip>
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
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Cerrar sesión</Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Box sx={{ flexGrow: 0.6 }} />
            {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledTextField
                autoComplete="off"
                value={ticketNumber}
                onChange={handleTicketNumberChange}
                placeholder="Buscar…"
                InputProps={{
                  "aria-label": "search",
                  endAdornment: (
                    <InputAdornment position="end">
                      {ticketNumber?.length > 1 && (
                        <IconButton onClick={handleTicketNumberClean}>
                          <Cancel />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                autoFocus={true}
              />
            </Search> */}
            <Box sx={{ flexGrow: 0.6 }} />

            <Tooltip title="Mis opciones">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, marginLeft: "2px" }}
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
                <Typography textAlign="center">Cerrar temporalmente</Typography>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
