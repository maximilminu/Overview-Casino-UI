import { Box } from "@mui/material";
import React from "react";
import { Outlet, useMatches } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Home = () => {
	const matches = useMatches();
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
