import { Box } from "@mui/material";
import React, { useLayoutEffect, useContext } from "react";
import { Outlet, useMatches } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { HardwareContext } from "@oc/hardware-context";
const Home = () => {
	const Hardware = useContext(HardwareContext);
	const matches = useMatches();
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
			<Navbar />
			<Box
				container="true"
				sx={{
					position: "fixed",
					top: "65px",
					bottom: "49px",
					left: 0,
					right: 0,
					overflow: "auto",
					backgroundColor: matches.length > 1 && "#eeeeeeb0",
				}}
			>
				{" "}
				<Outlet />
			</Box>
			<Footer />
		</>
	);
};

export default Home;
