import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { Box } from "@mui/material";
import { Outlet, useMatches } from "react-router-dom";
import { HardwareContext } from "@oc/hardware-context";
import { useLayoutEffect } from "react";

const Home = () => {
	const [headerHeight, setHeaderHeight] = useState(0);
	const [footerHeight, setFooterHeight] = useState(0);

	// eslint-disable-next-line
	const [disable, setDisable] = useState();
	const matches = useMatches();
	const Hardware = useContext(HardwareContext);

	useLayoutEffect(() => {
		Hardware.ConnectAll()
			.then((ret) => {
				console.log("Devices initialized:", ret);
			})
			.catch((err) => {
				console.log("Problems connecting devices:", err);
			});
	}, [Hardware]);

	return (
		<>
			<Navbar onHeightChange={setHeaderHeight} />
			<Box
				sx={{
					position: "fixed",
					top: headerHeight,
					bottom: footerHeight,
					left: 0,
					right: 0,
					overflow: "hidden",
					backgroundColor: matches.length > 1 && "#eeeeeeb0",
				}}
			>
				<Outlet />
			</Box>
			<Footer disable={disable} onHeightChange={setFooterHeight} />
		</>
	);
};

export default Home;
