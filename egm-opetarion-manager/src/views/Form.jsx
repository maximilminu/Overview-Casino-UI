import {
	Button,
	Paper,
	Typography,
	Box,
	Backdrop,
	TextField,
	Autocomplete,
	InputAdornment,
} from "@mui/material";
import { Container } from "@mui/system";

import React, { useContext, useEffect, useState } from "react";
import Roulette from "../components/Spinner/Roulette";
import { TicketDataCOntext } from "../context/TicketData";
import { ApiContext } from "../context/ApiContext";
import { NotifyUserContext } from "../context/NotifyUserContext";
import { Outlet, useNavigate, useOutlet } from "react-router";
import PaidIcon from "@mui/icons-material/Paid";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import NumbersIcon from "@mui/icons-material/Numbers";

import dayjs from "dayjs";

const Home = () => {
	const ifOutlet = useOutlet();
	dayjs.locale("es");
	const { setTicket } = useContext(TicketDataCOntext);
	const [data, setData] = useState();
	const [machines, setMachines] = useState([]);

	const [inputAutocomplete, setInputAutocomplete] = useState("");
	const NotifyUser = useContext(NotifyUserContext);
	const { Get } = useContext(ApiContext);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const [machineNumber, setMachineNumber] = useState("");
	const [loadingApi, setLoadingApi] = useState(false);
	const [dateTime, setDateTime] = useState(dayjs(Date.now()));

	// Cases: Notes - Barcode
	const handleChange = (e) => {
		e.preventDefault();
		setData({ ...data, [e.target.id]: e.target.value });
	};
	const handleChangeAmount = (e) => {
		e.preventDefault();
		setData({ ...data, [e.target.id]: +e.target.value });
	};

	// MACHINE Search
	const handleInputChange = (e, newInputValue) => {
		setInputAutocomplete(newInputValue);
	};

	// Set Time and Autocomplete data inputs
	useEffect(() => {
		if (dateTime) {
			setData({ ...data, Date: +dateTime.valueOf() });
		}
		// eslint-disable-next-line
	}, [dateTime]);

	useEffect(() => {
		if (inputAutocomplete) {
			setData({ ...data, PrintedIn: inputAutocomplete });
		} // eslint-disable-next-line
	}, [inputAutocomplete]);

	const handleSubmit = (e) => {
		e.preventDefault();
		getTicket();
	};

	const getTicket = () => {
		Get(
			`/ticket/v1/search/?PrintedIn=${data.PrintedIn}&Barcode=${data.Barcode}&Amount=${data.Amount}&Date=${data?.Date}`
		)
			.then((res) => {
				if (res.length !== 0) {
					setTicket(res[0]);
					setLoading(true);

					setTimeout(() => {
						navigate("ticket-print");
						setLoading(false);
					}, 700);
				} else NotifyUser.Error("No se pudo encontrar el ticket.");
			})
			.catch((err) => {
				NotifyUser.Error("No se pudo encontrar el ticket.");
			});
	};

	useEffect(() => {
		if (data?.PrintedIn?.length >= 6) {
			setLoadingApi(true);
			Get(`/machines/v1/autocomplete/?ID=${data?.PrintedIn}`)
				.then((res) => {
					const machineIDs = res.map((machine) => machine.Describe);

					setMachines(machineIDs.flat());
				})
				.catch((err) => console.log(err));
		}
		// eslint-disable-next-line
	}, [data]);

	return ifOutlet ? (
		<Outlet />
	) : (
		<Container sx={style.container}>
			{loading && (
				<Backdrop
					sx={{
						color: "#fff",
						zIndex: 0,
					}}
					open={true}
				>
					<Roulette />
				</Backdrop>
			)}
			<Paper elevation={3} sx={style.paper}>
				<Box>
					<Typography
						variant="h4"
						gutterBottom
						sx={{ textAlign: "center", marginBottom: "2rem" }}
					>
						Pago Irregular
					</Typography>

					<Box sx={{ width: "60rem" }}>
						<form
							autoComplete="off"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "column",
								gap: "1rem",
							}}
						>
							<Autocomplete
								id="PrintedIn"
								options={machines}
								includeInputInList
								sx={{ margin: ".5rem", width: "45%" }}
								value={machineNumber}
								onChange={(e, newValue) => {
									setMachineNumber(newValue);
									setData({ ...data, PrintedIn: newValue });
								}}
								inputValue={inputAutocomplete}
								onInputChange={handleInputChange}
								loading={loadingApi}
								loadingText="Buscando..."
								renderInput={(params) => (
									<TextField
										{...params}
										label="Número de Maquina"
										variant="standard"
									/>
								)}
							/>

							{/* Barcode */}
							<TextField
								id="Barcode"
								value={data?.Barcode || ""}
								onChange={handleChange}
								label="Número de Ticket"
								variant="standard"
								sx={{ margin: ".5rem", width: "45%" }}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<NumbersIcon />{" "}
										</InputAdornment>
									),
								}}
							/>

							{/* Machine */}

							<TextField
								id="Amount"
								onChange={handleChangeAmount}
								label="Monto"
								variant="standard"
								sx={{ margin: ".5rem", width: "45%" }}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<PaidIcon />
										</InputAdornment>
									),
								}}
							/>
							<DateTimePicker
								label="Hora y Fecha"
								disableFuture
								ampm
								openTo="day"
								renderInput={(props) => (
									<TextField
										{...props}
										sx={{ margin: ".5rem", width: "45%" }}
										variant="standard"
									/>
								)}
								value={dateTime}
								onChange={setDateTime}
							/>

							<Box sx={style.boxButton}>
								<Button
									variant="contained"
									sx={style.button}
									color="error"
									// disabled={!validate()}
									type="submit"
									onClick={handleSubmit}
								>
									Verificar
								</Button>
							</Box>
						</form>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

const style = {
	paper: {
		padding: "50px",
		display: "flex",
		backgroundColor: "white",
		marginBottom: "50px",
		marginTop: "50px",
		justifyContent: "center",
		width: "75%",

		alignItems: "center",
	},
	input: { width: "25rem", margin: "1.5rem 0" },

	inputBox: {
		padding: "2rem",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
	},
	container: {
		marginBottom: "40px",
		height: "85vh",
		flexDirection: "column",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},

	boxButton: { display: "flex", justifyContent: "end", padding: "1.2rem" },
	button: {
		padding: ".8rem",
	},
};

export default Home;