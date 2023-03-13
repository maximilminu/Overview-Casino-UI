import React from 'react'
import { Outlet, useMatches } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Box } from "@mui/material";


function Home() {
	const matches = useMatches();


	return (
		<>
			<Navbar />
			<Box
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
				<Outlet />
			</Box>
			<Footer />
		</>
	)
}

export default Home