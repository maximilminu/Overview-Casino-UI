import { Box } from "@mui/material";
import React, { useLayoutEffect, useContext, useState } from "react";
import { Outlet, useMatches } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { HardwareContext } from "@oc/hardware-context";
const Home = () => {
	const Hardware = useContext(HardwareContext);
	const matches = useMatches();
	const [headerHeight, setHeaderHeight] = useState(0);
	const [footerHeight, setFooterHeight] = useState(0);

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
			<Navbar
        		onHeightChange={setHeaderHeight}

      		/>
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
      		<Footer onHeightChange={setFooterHeight} />
		</>
	);
};

export default Home;
