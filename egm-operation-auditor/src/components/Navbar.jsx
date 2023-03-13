import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {
  TextField,
  ButtonGroup,
  Menu,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
  useMediaQuery,
  useTheme,
  Zoom,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import packageJson from "../../package.json";
import BarcodeButton from "./Buttons/BarcodeButton";
import { Cancel } from "@mui/icons-material";
import { ConfigContext } from "../context/ConfigProvider";
import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import Avatar from "./Avatar";
import { ApiContext } from "../context/ApiContext";
import { useParams, useNavigate } from "react-router-dom";
import Search from "./Search";

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

const StyledTextField = styled(TextField)(({ theme }) => ({
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

  "&	.MuiOutlinedInput-root": { color: "inherit" },
}));

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

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const config = useContext(ConfigContext);
  const theme = useTheme();
  const userProfile = useContext(UserContext);
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [valueTicket, setValueTicket] = useState("");
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { Logout } = useContext(ApiContext);
  const { numberTiket } = useParams();

  const handleTicketNumberClean = () => {
    setValueTicket("");
  };

  const search = (number) => {
    navigate(`/egm-operation-auditor/ticket/${number}`);
  };

  const onEmpty = (to) => {
    navigate("/egm-operation-auditor");
  };

  useEffect(() => {
    if (numberTiket) {
      setValueTicket(numberTiket);
    } else {
      setValueTicket("");
    }
  }, [numberTiket]);

  const handleTicketNumberChange = (ev) => {
    setValueTicket(ev.target.value);
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
        marginBottom: "40px",
        width: "100%",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          zIndex: theme.zIndex.drawer + 100,
          height: "7vh",
          backgroundColor: "#1c1c1d",
        }}
      >
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
              onClick={() => {
                navigate("/egm-operation-auditor");
              }}
              component="img"
              src={config.Images.LogoHeader}
              sx={{
                cursor: "pointer",
                objectFit: "contain",
                width: down600px ? "90px" : "160px",
                height: down600px ? "40px" : "46px",
              }}
            />
          </Tooltip>
        )}
        {down600px ? (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledTextField
                autoComplete="off"
                value={valueTicket}
                onChange={handleTicketNumberChange}
                placeholder="Buscar…"
                InputProps={{
                  "aria-label": "search",
                  endAdornment: (
                    <InputAdornment position="end">
                      {valueTicket?.length > 1 && (
                        <IconButton onClick={handleTicketNumberClean}>
                          <Cancel />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                autoFocus={true}
              />
            </Search>
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
              <MenuItem>
                <BarcodeButton />
              </MenuItem>

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
              <form onSubmit={handleSubmit}>
                <StyledTextField
                  id="valueSearch"
                  autoComplete="off"
                  value={valueTicket}
                  onChange={handleTicketNumberChange}
                  placeholder="Buscar…"
                  InputProps={{"aria-label": "search",
                    endAdornment: (
                      <InputAdornment position="end">
                        {valueTicket?.length > 1 && (
                          <IconButton
                            onClick={() => {
                              handleTicketNumberClean();
                              setValueTicket("");
                            }}>
                            <Cancel />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                  autoFocus={true}
                />
              </form>
            </Search> */}

            <Search
              value={valueTicket}
              onSearch={search}
              onEmpty={onEmpty}
              debounceTimeout={2000}
            />
            <Box sx={{ flexGrow: 0.6 }} />
            <ButtonGroup sx={{ marginInlineStart: "auto" }} color="inherit">
              <BarcodeButton />
            </ButtonGroup>
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
