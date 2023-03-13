import React, { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {
	ButtonGroup,
	IconButton,
	Menu,
	MenuItem,
	styled,
	Tooltip,
	tooltipClasses,
	Typography,
	useMediaQuery,
	useTheme,
	Zoom,
} from "@mui/material";
import CameraButton from "./Buttons/CameraButton";
import BarcodeButton from "./Buttons/BarcodeButton";
import { Link, useParams } from "react-router-dom";
import PrinterButton from "./Buttons/PrinterButton";
import packageJson from "../../package.json";
import SearchBar from "./SearchBar";
import { ConfigContext } from "@oc/config-context";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { ApiContext } from "@oc/api-context";
import { UserContext } from "@oc/user-context";

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
	const config = useContext(ConfigContext);
	const theme = useTheme();
	// eslint-disable-next-line
	const down600px = useMediaQuery(theme.breakpoints.down("sm"));
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const { param } = useParams();
	const navigate = useNavigate();
	const [anchorElUser, setAnchorElUser] = useState(null);
	const userProfile = useContext(UserContext);
	const { Logout } = useContext(ApiContext);

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

	const onSearch = (user) => {
		navigate(`/front-desk/member-list/${user}`);
	};

	const onEmpty = (to) => {
		navigate("/front-desk");
	};

	return (
		<AppBar
			sx={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				backgroundColor: "rgba(0,0,0,0.5)",
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
		>
			<Toolbar
				sx={{
					zIndex: theme.zIndex.drawer + 100,
					height: "8vh",
					backgroundColor: "#0e0e0e",
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
								src={config.Images.LogoHeader}
								sx={{
									width: down600px ? "140px" : "130px",
									height: "40px",
									marginTop: down600px && "5px",
								}}
							/>
						</Link>
					</HtmlTooltip>
				) : (
					<Tooltip TransitionComponent={Zoom} title={`v${packageJson.version}`}>
						<Link to="/front-desk">
							<Box
								component="img"
								src={config.Images.LogoHeader}
								sx={{ width: down600px ? "100px" : "130px", height: "60px" }}
							/>
						</Link>
					</Tooltip>
				)}
				{down600px ? (
					<>
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
								<CameraButton />
							</MenuItem>
							<MenuItem>
								<BarcodeButton />
							</MenuItem>
							<MenuItem>
								<PrinterButton />
							</MenuItem>
							<MenuItem onClick={handleLogout}>
								<Typography textAlign="center">Cerrar sesión</Typography>
							</MenuItem>
						</Menu>
					</>
				) : (
					<>
						<SearchBar value={param} onEmpty={onEmpty} onSearch={onSearch} />
						<ButtonGroup sx={{ marginInlineStart: "auto" }} color="inherit">
							<CameraButton />
							<BarcodeButton />
							<PrinterButton />
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
