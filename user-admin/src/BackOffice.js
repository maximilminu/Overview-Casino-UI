import "./App.css";
import SearchAppBar from "./components/SearchAppBar";
import { Box } from "@mui/material";
import Footer from "./components/Footer";
import React, { useState, useLayoutEffect } from "react";

import fakeListUser from "./mock-data.json";
import { PrinterProvider } from "./context/EscPosPrinterContext";
import { Route, Routes, useParams } from "react-router-dom";
import UserList from "./components/UserList";
import Home from "./views/Home";
import UserCard from "./components/UserCard";
function BackOffice() {
	const [screen, setScreen] = useState("Home");
	const [users, setUsers] = useState();
	const [open, setOpen] = React.useState(true);

	const { id } = useParams();
	console.log(id);

	useLayoutEffect(() => {
		setTimeout(() => {
			setUsers(fakeListUser);
			setOpen(false);
		}, 5000);
	}, []);

	const backToHome = () => {
		setScreen("Home");
	};

	const goToList = () => {
		setScreen("UserList");
	};

	const goToUserCard = () => {
		setScreen("UserCard");
	};

	return (
		<>
			<PrinterProvider>
				<SearchAppBar
					setScreen={setScreen}
					backToHome={backToHome}
					goToList={goToList}
					setUsers={setUsers}
					users={users}
				/>

				<Box
					square="true"
					sx={{
						pb: "50px",
						flexGrow: 1,
						paddingBottom: 1,
					}}
				>
					<Routes>
						<Route path="/user-admin" element={<Home />} />
						<Route
							path="/user-list-information"
							element={
								<UserList
									name={screen}
									users={users}
									setUsers={setUsers}
									goToUserCard={goToUserCard}
									open={open}
								/>
							}
						/>
						<Route path="/user-details/:id" element={<UserCard />} />
					</Routes>
		
				</Box>
				<Footer />
			</PrinterProvider>
		</>
	);
}

export default BackOffice;
