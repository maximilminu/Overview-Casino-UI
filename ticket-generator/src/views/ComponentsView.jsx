import { useContext, useEffect, useState } from "react";
import {
	Paper,
	TextField,
	Typography,
	Box,
	Backdrop,
	Grid,
	Autocomplete,
} from "@mui/material";
import {
	EscPosPrinterContext,
	PRINTER_STATUS_OFFLINE,
} from "../context/EscPosPrinterContext";
import Roulette from "../components/Spinner/Roulette";
import { ApiContext } from "../context/ApiContext";
import { NotifyUserContext } from "../context/NotifyUserContext.js";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import TicketUI from "../components/TicketUI";
import { BarcodeReaderContext } from "../context/BarcodeReaderContext";
import Captcha from "../components/Captcha";
// import { debounce } from "lodash";
import { LoadingButton } from "@mui/lab";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MuiPickersAdapterContext } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from 'dayjs';
import jwt_decode from "jwt-decode";

function Home() {
	const dateTimeFormatter = useContext(MuiPickersAdapterContext).utils;
	const { Printer } = useContext(EscPosPrinterContext);
	const { pathname } = useLocation()
	const [preData, setPreData] = useState({
		Barcode: "",
		Amount: 0,
		Date: dayjs( Date.now() ).valueOf() ,
		Notes: "",
		PrintedIn: "",
	});
	const [newData, setNewData] = useState({
		Amount: 0,
		Notes: "",
		PrintedIn: "",
	});
	
	const [machines, setMachines] = useState([])
	const NotifyUser = useContext(NotifyUserContext);
	const [loading, setLoading] = useState(false);
	const [loadingApi, setLoadingApi] = useState(false);
	const [count, setCount] = useState(1);
	const navigate = useNavigate();
	const { BarcodeReader } = useContext(BarcodeReaderContext);
	const AccessToken = localStorage.getItem("AccessToken");
	const token = AccessToken;
	const decoded = token && jwt_decode(token);
	const TokenType = localStorage.getItem("TokenType");
	const { Get, Post, Put } = useContext(ApiContext);
	const [confirmAuthorization, setConfirmAuthorization] = useState(false);
	const preInsert = "/ticket/pre-insert/"
	const [ dateTime, setDateTime ] = useState(dayjs(Date.now()));
	const [ ticketInfo, setTicketInfo ] = useState();


	// These two states are isolated, and should be controlled independently. [DOCUMENTACION: https://mui.com/material-ui/react-autocomplete/]
	const [inputAutocomplete, setInputAutocomplete] = useState("");
	const [machineNumber, setMachineNumber] = useState("");
	
	
	useEffect(() => {
		if (BarcodeReader.data) {
			if (BarcodeReader.data.length < 18) {
				NotifyUser.Info("Error leyendo el ticket, reintente.");
			} else {
				setPreData({...preData, Barcode: BarcodeReader.data});
			}
			BarcodeReader.clear();
		}
		// eslint-disable-next-line
	}, [BarcodeReader.data]);

	// Set Time and Autocomplete data inputs
	useEffect(() => {
		if (dateTime) {
			setPreData({...preData, Date: dateTime.valueOf()})
		}
		if (inputAutocomplete) {
		  setNewData({...newData, PrintedIn: inputAutocomplete})
		  setPreData({...preData, PrintedIn: inputAutocomplete})
		}
		// eslint-disable-next-line
	}, [dateTime, inputAutocomplete])

	useEffect(() => {}, [ticketInfo])


	


	// Pueden traer un ticket viejo, vencido, cobrado, falso, decirles anda palla bobo. !!!!!!!!!!!!!!!!!!!!!!!!!!!!
	
	// POST
	function correctValidationCaptcha() {
		if (!Printer.status === PRINTER_STATUS_OFFLINE) {
			if (pathname === "/ticket/new-insert/") {
				Post(`/ticket/v1/create-ticket`, newData)
					.then((res) => {
						setCount((prevState) => prevState + 1);
						setTicketInfo(res)
						const formatBcode = res.Barcode && res.Barcode.replace(/-/g, "");
						handlePrintTicket(res, formatBcode);						
					})
					.catch((err) => {
						NotifyUser.Error("El ticket no fue registrado");
						console.log(err);
					});
			} else {
				Post(`/ticket/v1/register-ticket`, preData)
					.then((res) => {
						setCount((prevState) => prevState + 1);
						setTicketInfo(res)
						const formatBcode = res.Barcode && res.Barcode.replace(/-/g, "");
						handlePrintTicket(res, formatBcode);
					})
					.catch((err) => {
						NotifyUser.Error("El ticket no fue registrado");
						console.log(err);
					});
			} 

		} else {
			NotifyUser.Error("Problemas comunicando con la impresora.");
		}

		setConfirmAuthorization(false)
		return
	}


	// MACHINE Search
	const handleInputChange = (e, newInputValue) => {


		// setTimeout(() => {
			// 	const machineNumbers = [
				// 		// {ID: "", Describe: [""]},
				// 		// {ID: "", Describe: [""]},{ID: "", Describe: [""]},{ID: "", Describe: [""]},{ID: "", Describe: [""]},{ID: "", Describe: [""]},
				
				
				
				// 		{label: "22300097", value: "22300097"}, 
				// 		{label: "22300401", value: "22300401"}, 
				// 		{label: "22300459", value: "22300459"}, 
				// 		{label: "22300417", value: "22300417"}, 
				// 		{label: "22300433", value: "22300433"}, 
				// 		{label: "22300479", value: "22300479"}, 
				// 		{label: "22300485", value: "22300485"}, 
				// 	]
				// 	setMachines(machineNumbers)
				
				// }, 2000)


		if (preData?.PrintedIn?.length >= 6) {
			setLoadingApi(true)
			Get(`/machines/v1/autocomplete/?ID=${preData?.PrintedIn}`)
				.then((res) => {
					const machineIDs = res.map((machine) => machine.Describe);
					setMachines(machineIDs.flat());
				})
				.catch((err) => console.log(err))
		}
		setInputAutocomplete(newInputValue)
	}

	const onFinish = () => {
		const { ID } = ticketInfo;

		if (ticketInfo?.ID !== undefined) {
			Put(`/ticket/v1/auth-pending/`, {ID: ID.toString()},
				{
					headers: {
						Authorization: `${TokenType} ${AccessToken}`,
					},
				}
			)
				.then((res) => {
					NotifyUser.Success("¡El estado del ticket fue guardado con éxito! Redirigiendo...");
					setTimeout(() => {
						navigate("/front-desk/");
					}, 2500);
				})
				.catch((err) => {
					if (err.response.status === 400) {
						NotifyUser.Error("El ticket ya fue autorizado previamente.");
					} else {
						NotifyUser.Error("Hubo un error finalizando el estado del ticket.");
					}
				}
				);
		} else {
			NotifyUser.Error("No se puede finalizar la operacion.");
		}

	}

	const handleSubmit = (e) => {
		e.preventDefault();
		setConfirmAuthorization(true)
	};

	// VALIDATE BUTTON PARA AMBOS FORMS
	const validate = () => {

		if (pathname === preInsert) {
			return (
				preData?.Amount?.toString().length >= 3 &&
				preData?.Date?.toString().length > 6 &&
				preData?.Barcode?.length < 18 && preData?.Barcode?.length > 16  &&
				preData?.PrintedIn?.length > 0 &&
				preData?.Notes?.length > 20
			);
		} else {
			return (
				newData?.Amount?.toString().length >= 3 &&
				newData?.PrintedIn?.length === 8 &&
				newData?.Notes?.length > 20
			);
		}
	}; 
	
	// Cases: Notes - Barcode
	const handleChange = (e) => {
		e.preventDefault();
		setNewData({ ...newData, [e.target.id]: e.target.value });
		setPreData({ ...preData, [e.target.id]: e.target.value });
	};
	const handleChangeAmount = (e) => {
		e.preventDefault();
		setNewData({ ...newData, [e.target.id]: +e.target.value });
		setPreData({ ...preData, [e.target.id]: +e.target.value });
	};

	// PRINTS
	const handlePrintTicket = (data) => {
		const value = +data?.Amount;
		const parsedValue = value?.toLocaleString("es-AR", {
			minimumFractionDigits: 2,
		});
		const barcodeFormat = data?.Barcode?.replace(
			/(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})/,
			"$1-$2-$3-$4-$5"
		)
		const formatBcode = data.Barcode && data.Barcode.replace(/-/g, "");
		console.log(formatBcode)

		Printer.print(
			(printer) =>
				new Promise((finishPrint) => {
					setLoading(true);
					setTimeout(() => {
						setLoading(false);
					}, 5000);

					printer
						.align("ct")
						.style("normal")
						.size(1, 1)
						.style("b")
						.text("CASINO CENTRAL")
						.feed(1)
						.size(0, 0)
						.text("Av. Patricio Peralta Ramos 2100 Mar del Plata")
						.feed(1)
						.size(2, 3)
						.text("VALE EN EFECTIVO")
						.feed(1)
						.feed(1)
						.raster(Printer.barcode(formatBcode))
						.feed(1)
						.size(0, 0)
						.text(`${barcodeFormat}`)

						.feed(2)
						.size(1, 0)
						.text(dateTimeFormatter.format(data.Date, "fullDateTime"))
						.feed(1)
						.size(1, 1)
						.text(`$${parsedValue} ARS`)
						.feed(1)
						.size(0, 0)
						.tableCustom(
							[
								{
									text: "VALIDO POR ",
									align: "CENTER",
									width: 1,
								},
								{
									text: `MáQUINA N° `,
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)
						.tableCustom(
							[
								{
									text: "30 DIAS",
									align: "CENTER",
									width: 1,
								},
								{
									text: `#${data.PrintedIn}`,
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)
						.align("lt")
						.feed(2)
						.text(`CREADO POR:                             FIRMA`)
						.feed(1)
						.text(`${decoded.Profile.FullName}`)
						.text("________________________________________________")
						.feed(2)
						.text("AUTORIZADO POR:                         FIRMA")
						.feed(2)
						.text("________________________________________________")

						.align("ct")
						.feed(2)
						.size(1, 0)
						.text("Solo cobrar por caja");

					finishPrint();
				}),
			(onError) => {
				console.log("ERROR Asking for printer", onError);
				NotifyUser.Error("Problemas comunicando con la impresora.");
			}
		);
	};

	const handlePrintTicketAgain = () => {
		setCount((prevState) => prevState + 1);
		const data = ticketInfo;
		const formatBcode = data.Barcode && data.Barcode.replace(/-/g, "");
		const value = +data?.Amount;
		const parsedValue = value?.toLocaleString("es-AR", {
			minimumFractionDigits: 2,
		});
		const barcodeFormat = data?.Barcode?.replace(
			/(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})/,
			"$1-$2-$3-$4-$5"
		)
		Printer.print(
			(printer) =>
				new Promise((finishPrint) => {
					setLoading(true);
					setTimeout(() => {
						setLoading(false);
					}, 5000);

					printer
						.align("ct")
						.style("normal")
						.size(1, 1)
						.style("b")
						.text("CASINO CENTRAL")
						.feed(1)
						.size(0, 0)
						.text("Av. Patricio Peralta Ramos 2100 Mar del Plata")
						.feed(1)
						.size(2, 3)
						.text("VALE EN EFECTIVO")
						.feed(1)
						.feed(1)
						.raster(Printer.barcode(formatBcode))
						.feed(1)
						.size(0, 0)
						.text(`${barcodeFormat}`)

						.feed(2)
						.size(1, 0)
						.text(dateTimeFormatter.format(data.Date, "fullDateTime"))
						.feed(1)
						.size(1, 1)
						.text(`$${parsedValue} ARS`)
						.feed(1)
						.size(0, 0)
						.tableCustom(
							[
								{
									text: "VALIDO POR ",
									align: "CENTER",
									width: 1,
								},
								{
									text: `MáQUINA N° `,
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)
						.tableCustom(
							[
								{
									text: "30 DIAS",
									align: "CENTER",
									width: 1,
								},
								{
									text: `${data?.PrintedIn}`,
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)

						.align("lt")
						.feed(2)
						.text(`CREADO POR:                             FIRMA`)
						.feed(1)
						.text(`${decoded.Profile.FullName}`)
						.text("________________________________________________")
						.feed(2)
						.text("AUTORIZADO POR:                         FIRMA")
						.feed(2)
						.text("________________________________________________")

						.align("ct")
						.feed(2)
						.size(1, 0)
						.text("Solo cobrar por caja")
						.feed(2)
						.size(0, 0)
						.text(`${"Re-impresion N°" + (count - 1)}`);

					finishPrint();
				}),
			(onError) => {
				console.log("ERROR Asking for printer", onError);
				NotifyUser.Error("Problemas comunicando con la impresora.");
			}
		);
	};

	console.log("PATHNAME", pathname)
	
	return (
		
		<Grid container maxWidth="100vw" sx={style.container}>

			
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

			<Grid item sm={8} lg={6} sx={{ display: "flex", justifyContent: { xs: "center", lg: "flex-end" }, marginBottom: 0, }} >
				<Paper elevation={3} sx={style.paper}>
					<Box>
						<Typography variant="h4" gutterBottom>
							Generar Ticket
						</Typography>
					</Box>

					<form autoComplete="off">
						<Box sx={style.inputBox}>
							{/* //!?Remove autocomplete somehow */}
							{pathname.includes("/ticket/pre-insert") && (
								<Grid container spacing={2}>
									<Grid item xs={12} sx={{ display: "flex" }}>

										{/* Barcode */}
										<TextField 
											id="Barcode" 
											value={preData?.Barcode || ""} 
											onChange={handleChange} 
											label="Codigo de Barras" 
											variant="standard" 
											sx={{ margin: ".5rem", width: "45%"}} 
											defaultValue={"00"}
										/>
										
										{/* Machine */}
										<Autocomplete
											id="PrintedIn"
											options={machines}
											includeInputInList
											sx={{ margin: ".5rem", width: "45%"}}
											value={machineNumber}
											onChange={(e, newValue) => {
												setMachineNumber(newValue);
												setPreData({...preData, PrintedIn: e.target.value})
											}}
											inputValue={inputAutocomplete}
											onInputChange={handleInputChange}
											loading={loadingApi}
											loadingText="Buscando..."
											
											renderInput={(params) => <TextField {...params} label="Nro. de Máquina" variant="standard" />}
										/>
										{/* Amount */}

									</Grid>
								
									<Grid item xs={12} sx={{ display: "flex" }}>

										{/* Date */}
										<DateTimePicker
											label="Hora y Fecha"
											renderInput={props => <TextField {...props} sx={{ margin: ".5rem", width: "45%"}} variant="standard" />}
											value={ dateTime }
											onChange={ setDateTime }
										/>

										<TextField 
											id="Amount" 
											onChange={handleChangeAmount} 
											label="Monto" variant="standard" 
											sx={{ margin: ".5rem", width: "45%"}} 
										/>

									</Grid>

									<Grid item xs={12} sx={{ width: "100%" }}>

										{/* Notes */}
										<TextField
											id="Notes"
											label="Motivo"
											placeholder="Motivo"
											multiline
											variant="standard"
											onChange={handleChange}
											sx={{ margin: ".5rem 0 .5rem .5rem", width: "93%"}}
										/>

									</Grid>
								</Grid>
							)}
							
							{ pathname.includes("/ticket/new-insert") && (
								<Grid container spacing={2}>
									<Grid item xs={12} sx={{ display: "flex" }}>

										{/* Machine */}
										<Autocomplete
											id="PrintedIn"
											options={machines}
											includeInputInList
											sx={{ margin: ".5rem", width: "45%"}}
											value={machineNumber}
											onChange={(e, newValue) => {
												setMachineNumber(newValue);
												setPreData({...preData, PrintedIn: e.target.value})
											}}
											inputValue={inputAutocomplete}
											onInputChange={handleInputChange}
											loading={loadingApi}
											loadingText="Buscando..."
											
											renderInput={(params) => <TextField {...params} label="Nro. de Máquina" variant="standard" />}
										/>

										{/* Amount */}
										<TextField 
											id="Amount" 
											onChange={handleChangeAmount} 
											label="Monto" 
											variant="standard" 
											sx={{ margin: ".5rem", width: "45%"}} 
										/>

									</Grid>

									<Grid item xs={12} sx={{ width: "100%" }}>

										{/* Notes */}
										<TextField
											id="Notes"
											label="Motivo"
											placeholder="Motivo"
											multiline
											variant="standard"
											onChange={handleChange}
											sx={{ margin: ".5rem 0 .5rem .5rem", width: "93%"}}
										/>
									</Grid>
								</Grid>
								)

							}

						</Box>
						<Box sx={style.boxButton}>
							<LoadingButton
								variant="contained"
								loading={loading}
								onClick={count > 1 ? handlePrintTicketAgain : handleSubmit}
								sx={style.button}
								color="error"
								disabled={!validate()}
								type="submit"
							>
								{count >= 2
									? "Re-imprimir Ticket Creado"
									: "Crear E Imprimir Ticket Muleto"}
							</LoadingButton>
						</Box>
					</form>
				</Paper>
			</Grid>

			<Grid item sm={8} lg={6} sx={{ padding: "2rem", display: "flex", justifyContent: { xs: "center", lg: "flex-end" }, flexDirection: "column"}}>
				<Paper elevation={0} sx={style.paperTicket}>
					<Typography sx={{ marginTop: { xs: "5px", md: "0" }, fontSize: { xs: "1.5rem", md: "2.215rem" }, padding: 0, color: "white" }} variant="h4">
						VISTA PREVIA
					</Typography>
				</Paper>
				<TicketUI 
					data={preData} 
					pathname={pathname} 
				/>
				{count >= 2 && 
				<Paper elevation={0} sx={style.buttonPaper}>
					<LoadingButton
								variant="contained"
								onClick={onFinish}
								sx={style.button}
								color="error"
								type="submit"
							>
								FINALIZAR OPERACIÓN
					</LoadingButton>
				</Paper>
				}
			</Grid>

			<Captcha
				title={
					"Para confirmar la autorización del ticket clickeá el número"
				}
				onContinue={correctValidationCaptcha}
				open={confirmAuthorization}
				onCancel={() => {
					setConfirmAuthorization(false);
				}}
			/>

		</Grid>
	)
}

const style = {
	paperTicket: {
		backgroundColor: "#d32f2f",
		alignSelf: {xs: "center", lg: "flex-start"},
		color: "black",
		display: "flex",
		justifyContent: "center",
		width: { xs: "fit-content", md: "30rem" },
		// position: "relative",
		py: ".5rem", 
		marginLeft: {xs: 0, lg: "2rem"},
		marginBottom: "1.1rem",
		marginTop: {xs: 0, lg: "-2rem"},
		
		// padding: { xs: "5px", md: "30px" },
		// marginTop: "15px",
		
	},
	paper: {
		width: { xs: "24.375rem", md: "30rem" },
		padding: "2rem",
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		gap: "20px",
		backgroundColor: "white",
		marginBottom: "50px",
		marginTop: "50px",
    	marginRight: {xs: 0, lg: "4rem"},
	},
	inputBox: { 
		padding: "2rem",
		display: 'flex', 
		// flexWrap: 'wrap',
	},
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: "40px",
		height: "85vh",
	},

	boxButton: { display: "flex", justifyContent: "end", padding: "1.2rem" },
	button: {
		
		display: "flex",
		alignSelf: {xs: "center", lg: "flex-start"},
		// justifyContent: "center",
		// position: "relative",
		// marginLeft: {xs: 0, lg: "3.5rem"},
		// marginBottom: "1.1rem",
		// marginTop: {xs: 0, lg: "-2rem"},
		
		// padding: { xs: "5px", md: "30px" },
		// marginTop: "15px",
	},
	buttonPaper: {
		width: { xs: "100%", md: "30rem" },
		marginLeft: {xs: "auto", lg: "2rem"},
		backgroundColor: "transparent",
		marginRight: {xs: "auto", lg: "0"},
		marginTop: ".8rem",
		alignSelf: "flex-start",
		display: "flex",
		justifyContent: "center",
	}
};

export default Home