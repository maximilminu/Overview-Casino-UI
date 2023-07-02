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
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import { Outlet, useLocation, useNavigate, useOutlet } from "react-router";
import PaidIcon from "@mui/icons-material/Paid";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import NumbersIcon from "@mui/icons-material/Numbers";

import dayjs from "dayjs";
import { debounce } from "lodash";

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
	const location = useLocation();
	const navigate = useNavigate();
	const [machineNumber, setMachineNumber] = useState("");
	const [loadingApi, setLoadingApi] = useState(false);
	const [dateTime, setDateTime] = useState(dayjs(Date.now()));

	useEffect(() => {
		console.log(location);
		if (location.pathname === "/egm-operation-manager/ticket-validate") {
			setData({});
			setMachineNumber("");
			setDateTime();
		}
	}, [location]);

	// Cases: Notes - Barcode
	const handleChange = (e) => {
		e.preventDefault();
		setData({ ...data, [e.target.id]: e.target.value });
	};
	const handleChangeAmount = (e) => {
		e.preventDefault();

		const { value } = e.target;
		const newValue =
			// busca la coma en el valor value y la reemplaza por un punto.
			value
				.replace(",", ".")
				//expresión regular para buscar puntos adicionales que puedan existir después del primer punto y los borra
				.replace(/\.(?=\d*\.)/g, "");

		setData({ ...data, [e.target.id]: newValue });
	};

	const handleKeyPressAmount = (e) => {
		const allowedChars = /[0-9.,]/;
		const charCode = e.charCode;
		const char = String.fromCharCode(charCode);
		if (!allowedChars.test(char)) {
			e.preventDefault();
		}
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

	const validate = (data) => {
		const amountString = data?.Amount?.toString();
		return (
			amountString?.length > 2 &&
			data?.Barcode?.length > 3 &&
			data?.PrintedIn?.length > 3
		);
	};

	const getTicket = () => {
		Get(
			`/ticket/v1/search/?PrintedIn=${encodeURIComponent(
				data.PrintedIn
			)}&Barcode=${encodeURIComponent(
				data.Barcode
			)}&Amount=${encodeURIComponent(data.Amount)}&Date=${encodeURIComponent(
				data?.Date
			)}`
		)
			.then(({ data }) => {
				if (data.length !== 0 && data[0].Status === 0) {
					setLoading(true);
					setTicket(data[0]);

					setTimeout(() => {
						navigate("ticket-print");
						setLoading(false);
					}, 2000);
				} else if (data[0].Status === 10) {
					NotifyUser.Warning("Este ticket ya fue reemplazado por muleto");
				} else if (data[0].Status === 13) {
					NotifyUser.Warning(
						"Ese ticket ya se encuentra pendiente de autorización"
					);
				} else NotifyUser.Error("No se pudo encontrar el ticket.");
			})
			.catch((err) => {
				console.log("error", err);
				NotifyUser.Error("No se pudo encontrar el ticket.");
				NotifyUser.Error(
					`Problemas con el servicio de verificación de ticket. Notifique al servicio técnico (${err.response.status}).`
				);
			});
	};

	useEffect(() => {
		const delayedSearch = debounce(() => {
			if (data?.PrintedIn?.length >= 4) {
				setLoadingApi(true);
				setTimeout(() => {
					Get(`/machines/v1/autocomplete/?ID=${data?.PrintedIn}`)
						.then(({ data }) => {
							const machineIDs = data.map((machine) => machine.Describe);
							setMachines(machineIDs.flat());
						})
						.catch((err) => console.log(err))
						.finally(() => setLoadingApi(false));
				}, 500);
			}
		}, 800);

		delayedSearch();

		return delayedSearch.cancel;

		//eslint-disable-next-line
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
						Pago Irregular de Ticket
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
								clearOnBlur={true}
								includeInputInList
								autoHighlight
								noOptionsText={
									data?.PrintedIn?.length >= 4
										? "No se encontraron resultados"
										: "Comience a escribir para buscar"
								}
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
										label="Número de Máquina"
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
								type="number"
								sx={{
									margin: ".5rem",
									width: "45%",
									'input[type="number"]::-webkit-inner-spin-button': {
										WebkitAppearance: "none",
										margin: 0,
									},
									'input[type="number"]::-webkit-outer-spin-button': {
										WebkitAppearance: "none",
										margin: 0,
									},
								}}
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
								onKeyPress={handleKeyPressAmount}
								variant="standard"
								sx={{
									margin: ".5rem",
									width: "45%",
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<PaidIcon />
										</InputAdornment>
									),
								}}
							/>
							<DateTimePicker
								label="Fecha y Hora  "
								disableFuture
								openTo="day"
								ampm
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
									disabled={!validate(data)}
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
