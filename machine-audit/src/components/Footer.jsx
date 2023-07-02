import React, { useContext, useRef, useEffect } from "react";
import { UNSAFE_RouteContext } from "react-router-dom";
import {
	Box,
	AppBar,
	useMediaQuery,
	useTheme,
	Tooltip,
	Zoom,
	tooltipClasses,
	styled,
} from "@mui/material";
import packageJson from "../../package.json";
import { ConfigContext } from "@oc/config-context";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";

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

export default function Footer(props) {
	const config = useContext(ConfigContext);
	const theme = useTheme();
	const down600px = useMediaQuery(theme.breakpoints.down("sm"));
	const routeContext = useContext(UNSAFE_RouteContext);
	const routes = routeContext.matches[0].route;
	const navigate = useNavigate();
	const ref = useRef(false);

	useEffect(() => {
		if (props.onHeightChange) {
			props.onHeightChange(ref.current.offsetHeight);
		}
		// eslint-disable-next-line
	}, [ref]);

	const handleLogoClick = () => {
		const currentUrl = window.location.href;
		const baseUrl = currentUrl.substring(
			0,
			currentUrl.indexOf(routes.path) + 1
		);
		window.location.href = `${baseUrl}home`;
	};
	return (
		<>
			{/* Footer where info will be placed inside */}
			<AppBar
				position="fixed"
				sx={{
					backgroundColor: "#0e0e0e",
					top: "auto",
					bottom: 0,
					display: "flex",
					alignItems: "center",
					flexDirection: "row",
					justifyContent: "space-between",
					width: "100%",
				}}
				ref={ref}
				component="footer"
			>
				<Box
					sx={{
						width: { xl: "30%", lg: "30%", md: "45%" },
						marginX: { md: 3, sm: 1 },
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Box
						onClick={() => {
							if (packageJson.version.includes("rc")) {
								handleLogoClick();
							} else {
								navigate(routes.path);
							}
						}}
						component="img"
						src={config?.Images?.LogoFooterLeft}
						sx={{
							cursor: "pointer",
							objectFit: "contain",
							width: down600px ? "100px" : "120px",
							height: "60px",
						}}
					/>
					<Breadcrumbs />
				</Box>

				<Box
					sx={{
						width: "30%",
						display: "flex",
						justifyContent: "flex-end",
						marginX: { md: 3, sm: 1 },
					}}
				>
					{packageJson.version.includes("rc") ? (
						<HtmlTooltip
							TransitionComponent={Zoom}
							title={`v${packageJson.version}`}
						>
							<Box
								onClick={() => {
									navigate(routes.path);
								}}
								component="img"
								src={config.Images.LogoFooterRight}
								sx={{
									cursor: "pointer",
									objectFit: "contain",
									height: down600px ? "40px" : "46px",
								}}
							/>
						</HtmlTooltip>
					) : (
						<Tooltip
							TransitionComponent={Zoom}
							title={`v${packageJson.version}`}
						>
							<Box
								component="img"
								src={config.Images.LogoFooterRight}
								sx={{
									cursor: "pointer",
									objectFit: "contain",
									height: down600px ? "40px" : "46px",
								}}
							/>
						</Tooltip>
					)}
				</Box>
				{/* </Toolbar> */}
			</AppBar>
		</>
	);
}
