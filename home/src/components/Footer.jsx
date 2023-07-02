import React, { useEffect, useRef } from "react";
import {
	AppBar,
	Toolbar,
	IconButton,
	Tooltip,
	Zoom,
	styled,
	tooltipClasses,
} from "@mui/material";
import DeskIcon from "@mui/icons-material/Desk";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import DevicesIcon from "@mui/icons-material/Devices";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AddHomeIcon from "@mui/icons-material/AddHome";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LockResetIcon from "@mui/icons-material/LockReset";
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddchartIcon from '@mui/icons-material/Addchart';
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
const handleLogoClick = (path) => {
	const currentUrl = window.location.href;
	const baseUrl = currentUrl.substring(0, currentUrl.indexOf("/", 8));
	window.location.href = `${baseUrl}/${path}`;
};

const navItems = [
	{
		UI: "Front-desk",
		URL: "front-desk",
		ICON: <DeskIcon />,
	},
	{
		UI: "EGM Operation Manager",
		URL: "egm-operation-manager",
		ICON: <NoteAddIcon />,
	},
	{
		UI: "Ticket Generator",
		Description: " TOtalmente nuevo",
		URL: "ticket",
		ICON: <FiberNewIcon />,
	},

	{
		UI: "EGM Operation Auditor",
		URL: "egm-operation-auditor",
		ICON: <AssignmentIcon />,
	},
	{
		UI: "Cashier",
		URL: "cashier",
		ICON: <PointOfSaleIcon />,
	},

	{
		UI: "User Management",
		URL: "user-management",
		ICON: <ContactEmergencyIcon />,
	},
	{
		UI: "New Password",
		URL: "new-password",
		ICON: <LockResetIcon />,
	},
	{
		UI: "Network-Devices",
		URL: "network-devices",
		ICON: <DevicesIcon />,
	},
	{
		UI: "Area Management",
		URL: "area-managment",
		ICON: <AddHomeIcon />,
	},
	{
		UI: "EGM Drop",
		URL: "egm-drop",
		ICON: <DisplaySettingsIcon />,
	},
	{
		UI: "Machine Audit",
		URL: "machine-audit",
		ICON: <FormatListNumberedIcon />,
	},
	{
		UI: "Jaza Report",
		URL: "jaza-report",
		ICON: <AddchartIcon />,
	},
	{
		UI: "Jaza Reported",
		URL: "jaza-reported",
		ICON: <AssessmentIcon />,
	},
	
];
export default function Footer(props) {
	const ref = useRef(false);
	useEffect(() => {
		if (props.onHeightChange) {
			props.onHeightChange(ref.current.offsetHeight);
		}
		// eslint-disable-next-line
	}, [ref]);

	const BootstrapTooltip = styled(({ className, ...props }) => (
		<Tooltip {...props} arrow classes={{ popper: className }} />
	))(({ theme }) => ({
		[`& .${tooltipClasses.tooltip}`]: {
			fontSize: 15,
		},
	}));

	return (
		<>
			{/* Footer where info will be placed inside */}
			<AppBar
				position="fixed"
				color="primary"
				sx={{
					backgroundColor: "#0e0e0e",
					top: "auto",
					bottom: 0,
				}}
				ref={ref}
				component="footer"
			>
				{/* Corresponding wrapper for content */}
				<Toolbar
					style={{
						display: "flex",
						justifyContent: "space-around",
						fontSize: "20px",
					}}
				>
					{navItems.map((ui) => (
						<BootstrapTooltip
							key={ui.UI}
							TransitionComponent={Zoom}
							arrow
							title={ui.UI}
						>
							<IconButton
								sx={{ color: "white" }}
								onClick={() => handleLogoClick(ui.URL)}
							>
								{ui.ICON}
							</IconButton>
						</BootstrapTooltip>
					))}
				</Toolbar>
			</AppBar>
		</>
	);
}
