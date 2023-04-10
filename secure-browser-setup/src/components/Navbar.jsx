import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Logo from "../assests/logo.jpg";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
  useMediaQuery,
  useTheme,
  Zoom,
} from "@mui/material";
import CameraButton from "./Buttons/CameraButton";
import BarcodeButton from "./Buttons/BarcodeButton";
import { Link } from "react-router-dom";
import PrinterButton from "./Buttons/PrinterButton";
import SearchBar from "./SearchBar";
import packageJson from "../../package.json";

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
  const theme = useTheme();
  const [memberSearch, setMemberSearch] = React.useState();
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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
            <Link to="/front-desk">
              <Box
                component="img"
                src={Logo}
                sx={{ width: down600px ? "100px" : "130px", height: "60px" }}
              />
            </Link>
          </HtmlTooltip>
        ) : (
          <Tooltip TransitionComponent={Zoom} title={`v${packageJson.version}`}>
            <Link to="/front-desk">
              <Box
                component="img"
                src={Logo}
                sx={{ width: down600px ? "100px" : "130px", height: "60px" }}
              />
            </Link>
          </Tooltip>
        )}
        {down600px ? (
          <>
            <Button sx={{ marginInlineStart: "auto" }} onClick={handleClick}>
              <MenuIcon sx={{ color: "third.main" }} />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem>
                <CameraButton />
              </MenuItem>
              <MenuItem>
                <BarcodeButton />
              </MenuItem>
              <MenuItem>
                <PrinterButton />
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <SearchBar setMemberSearch={setMemberSearch} />
            <ButtonGroup sx={{ marginInlineStart: "auto" }} color="inherit">
              <CameraButton />
              <BarcodeButton />
              <PrinterButton />
            </ButtonGroup>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
