import React, { useContext, useState } from "react";
import {
	Box,
	Button,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	styled,
	tableCellClasses,
	Tooltip,
	tooltipClasses,
	TableContainer,
	useMediaQuery,
	useTheme,
	Alert,
	TextField
} from "@mui/material";
import Barcode from "react-barcode";
import { ApiContext } from "../context/ApiContext";
import { NotifyUserContext } from "../context/NotifyUserContext";
import MotiveModal from "./MotiveModal";
import { FormatLocalCurrency } from "../utils/Intl";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";

const style = {
	tableCell: {
		fontWeight: "700",
		color: "rgb(123, 128, 154)",
		textTransform: "uppercase",
		margin: "0 auto",
		lineHeight: "15px",
	},
	typography: {
		fontWeight: "700",
		fontSize: "12px",
		marginLeft: "25px",
		marginBottom: "10px",
		color: "rgb(123, 128, 154)",
		textTransform: "uppercase",
	},
	paper: {
		backgroundColor: "white",
		color: "black",
		maxWidth: "700px",
		height: { xl: "100%", lg: "50%" },
		position: "relative",
		marginLeft: "auto",
		marginRight: "auto",
		padding: "30px",
		marginTop: "15px",
	},
	topTableCell: {
		color: "rgb(65, 67, 82)",
		fontWeight: "700",
		textTransform: "uppercase",
		margin: "0 auto",
		lineHeight: "15px",
	},
};

const styledTexFieldData = {
	".MuiOutlinedInput-notchedOutline":{
		borderColor: "#fff !important",
		borderRadius:"0px",
		border:"none",
		borderBottom:"solid 1px"
	 },
	
	".MuiInputBase-input": {
		WebkitTextFillColor: "#fff",													
	},
	".MuiInputLabel-root": {
		WebkitTextFillColor: "#fff",															
	},
	".MuiSvgIcon-root":{
		WebkitTextFillColor: "#fff",															
		color:"#fff",
	},
	
	
}



const HtmlTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "white",
		fontWeight: 600,
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: "15px",
		border: "1px solid #dadde9",
	},
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({

	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},

	[`&.${tableCellClasses.body}`]: {
		fontSize: 15,
	},
}));

const SingleTicketView = ({showButtons,data,setConfirmAuthorization,onContinue,counterInfo,showInformationTicket,notFoundContadores}) => {
	// eslint-disable-next-line

	const NotifyUser = useContext(NotifyUserContext);
	const [unauthorizedMotive, setUnauthorizedMotive] = useState();
	const [showMotiveModal, setShowMotiveModal] = useState(false);
	const theme = useTheme();
	const down600px = useMediaQuery(theme.breakpoints.down("sm"));
	const [valueTimeFrom, setValueTimeFrom] = useState(dayjs('2023-08-18T21:11:54'));
	const [valueTimeUntil, setValueTimeUntil] = useState(dayjs('2023-08-18T21:11:54'));

	const { Post } = useContext(ApiContext);

	const expirationDate = () => {
		const parseado = new Date(data?.PrintedAt);
		parseado.setMonth(parseado.getMonth() + 1);
		return (
			parseado.getDate() +
			"/" +
			(parseado.getMonth() + 1) +
			"/" +
			parseado.getFullYear()
		);
	};
	const expiration = expirationDate();


	const handleChangeTimeFrom = (newValue) => {
		console.log(newValue)
		setValueTimeFrom(newValue);
	  };

	const handleChangeTimeUntil = (value) => {
		console.log(value)
		setValueTimeUntil(value);
	};
	  
	const handleClose = () => {
		setShowMotiveModal(false);
		// setValue("")
	};

	const handleSubmitUnauthorizedTicket = () => {
		Post(`/ticket/v1/authorize-ticket/${data.ID}`, {
			Status: 6,
			Notes: unauthorizedMotive,
		}).then((res) => {
			setShowMotiveModal(false);
			onContinue();
			NotifyUser.Info("Se ha guardado la información en el sistema.");
		});
	};

	return (
		<>
			<Grid container spacing={2} sx={{ justifyContent: "center" }}>
				<Grid item xl={3} lg={4} xs={12} md={8} sx={{ height: "100%" }}>
					{showInformationTicket && (
						<Paper sx={{ marginTop: "1rem" }}>
							<TableContainer>
								<Table>
									<TableBody>
										<TableRow key={data.ID}>
											<TableRow key={data.ID}>
												<TableCell sx={style.topTableCell}>
													Autorizado por:
												</TableCell>
												<TableCell sx={style.topTableCell}>
													{data.AuthorizedBy}
												</TableCell>
											</TableRow>
											<TableRow key={data.ID}>
												<TableCell sx={style.topTableCell}>
													Autorizado el:
												</TableCell>
												<TableCell sx={style.topTableCell}>
													{new Date(data.AuthorizedAt).toLocaleString("es-AR")}
												</TableCell>
											</TableRow>
											<TableRow key={data.ID}>
												<TableCell sx={style.topTableCell}>
													Ticket Original:
												</TableCell>
												<TableCell sx={style.topTableCell}>
													{data.Barcode.slice(1)}
												</TableCell>
											</TableRow>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					)}

					<Paper elevation={3} sx={style.paper}>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Grid
								container
								spacing={{ xl: showButtons ? 5 : 3, lg: 2 }}
								sx={{
									marginTop: { lg: "5px" },
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Grid
									item
									sx={{
										marginTop: !showButtons && "-25px",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<Typography
										variant="h4"
										sx={{
											fontSize: { xs: "2rem" },
										}}
									>
										CASINO CENTRAL
									</Typography>
									<Typography sx={{ textAlign: { xs: "center" } }}>
										Av. Patricio Peralta Ramos 2100 Mar del Plata
									</Typography>
								</Grid>
								<Grid item>
									<Barcode width={1} value={data?.Barcode} />
								</Grid>
								<Grid item>
									<Typography>
										{new Date(data?.PrintedAt).toLocaleString("es-AR")}
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant="h3">
										$
										{data?.Amount.toLocaleString("es-AR", {
											minimumFractionDigits: 2,
										})}
									</Typography>
								</Grid>
								<Grid
									container
									sx={{
										marginTop: { xl: showButtons && "50px" },
										gap: { xs: "15px" },
										justifyContent: {
											xs: "center",
											sm: "center",
											lg: "space-evenly",
										},
										alignItems: "stretch",
									}}
									direction="row"
								>
									<Grid
										item
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											marginLeft: { xl: "35px" },
										}}
									>
										<Typography>VÁLIDO POR 30 DÍAS</Typography>
										<Typography variant="body2">{expiration}</Typography>
									</Grid>
									<Grid item>
										<Typography>MAQUÍNA #{data?.PrintedIn}</Typography>
									</Grid>
								</Grid>
							</Grid>
						</Box>
					</Paper>
				</Grid>

				<Grid
					item
					xs={12}
					md={8}
					sx={{
						marginBottom: down600px && "50px",
						marginTop: { xl: "15px" },
					}}
				>
					<TableContainer
						component={Paper}
						sx={{
							height: { xl: "100%", lg: "100%", md: 700 },
						}}
					>
						<Table sx={{ minWidth: 400}}>
							<TableHead>
								<TableRow>

									<StyledTableCell 
										align="center" 
										colSpan={15}
										
										>
											
										<Box
											sx={{
												display:"flex",
												justifyContent:"space-around",
												alignItems:"center"}}>
											<h1>
												Contadores
											</h1>
											<DateTimePicker
												label="Desde"
												value={valueTimeFrom}
												onChange={handleChangeTimeFrom}
												renderInput={(params) => <TextField disableUnderline sx={styledTexFieldData} {...params} />}/>

											<DateTimePicker
											label="Hasta"
											value={valueTimeUntil}
											onChange={handleChangeTimeUntil}
											renderInput={(params) => <TextField sx={styledTexFieldData} {...params} />} />
											<TextField

												type="number"
												InputProps={{
													inputProps: { 
														max: 100, min: 10,
													}
												}}
												label=""
												sx={styledTexFieldData}
											/>
										</Box>
										
									</StyledTableCell>
									
									
								</TableRow>
								<TableRow>
									<TableCell sx={style.tableCell} align="left">
										Fecha
									</TableCell>
									<TableCell sx={style.tableCell} align="center">
										Evento
									</TableCell>
									<TableCell sx={style.tableCell} align="center">
										Total IN
									</TableCell>
									<TableCell sx={style.tableCell} align="center">
										Total OUT, <br /> HandPay
									</TableCell>
									<TableCell sx={style.tableCell} align="center">
										Bet
									</TableCell>
									<TableCell sx={style.tableCell} align="center">
										Jackpot, <br /> Win
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{notFoundContadores?
									<Box sx={{
										display:"flex",
										justifyContent:"center",
										alignContent:"center",
										position:"relative",
										left:"60%",
										marginTop:"35%"
									}}>
										<Alert severity="warning">No se han encontrado contadores para este Ticket</Alert>
									</Box>							
								:<>
										{(counterInfo || []).map((contador) => (
										<TableRow
											key={contador.Date}
											sx={{
												"&:last-child td, &:last-child th": { border: 0 },
											}}
										>
											<TableCell component="th" scope="row">
												{new Date(contador.Date).toLocaleString("es-AR")}
											</TableCell>
											<TableCell component="th" align="center" scope="row">
												{contador.Events || "Sin datos"}
											</TableCell>
											<TableCell component="th" align="center" scope="row">
												{FormatLocalCurrency(contador.TotalIn) || "Sin datos"}
											</TableCell>
											<HtmlTooltip
												title={
													`TOTALOUT: ${contador.TotalOut} + HANDPAY: ${contador.Handpay}` ||
													"Sin datos"
												}
											>
												<TableCell align="center" component="th" scope="row">
													{FormatLocalCurrency(
														contador.TotalOut + contador.Handpay
													) || "Sin datos"}
												</TableCell>
											</HtmlTooltip>
											<TableCell align="center" component="th" scope="row">
												{FormatLocalCurrency(contador.Bets) || "Sin datos"}
											</TableCell>
											<HtmlTooltip
												title={
													`JACKPOT: ${contador.Jackpot} + WIN: ${contador.Wins} ` ||
													"Sin datos"
												}
											>
												<TableCell align="center" component="th" scope="row">
													{FormatLocalCurrency(
														contador.Jackpot + contador.Wins
													) || "Sin datos"}
												</TableCell>
											</HtmlTooltip>
										</TableRow>
									))}
								</>}
							</TableBody>
						</Table>
					</TableContainer>
					{showButtons && (
						<Box
							sx={{
								gap: "15px",
								marginTop: { md: "30px" },
								marginBottom: "25px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Button
								variant="contained"
								sx={{
									width: "200px",
									color: "third.main",
									backgroundColor: "black",
								}}
								onClick={() => {
									setShowMotiveModal(true);
								}}
							>
								Desautorizar
							</Button>
							<Button
								sx={{
									width: "200px",
									marginLeft: "15px",
									backgroundColor: "third.main",
									color: "red",
									"&:hover": {
										color: "white",
									},
								}}
								variant="contained"
								onClick={() => {
									setConfirmAuthorization(true);
								}}
							>
								Autorizar
							</Button>
						</Box>
					)}
				</Grid>
			</Grid>

			<MotiveModal
				title={"Ingresa el motivo por el cual desautorizas el ticket."}
				open={showMotiveModal}
				onClose={handleClose}
				onChange={setUnauthorizedMotive}
				onClick={handleSubmitUnauthorizedTicket}
				exitText={"Cancelar"}
				confirmText={"Confirmar"}
			/>
		</>
	);
};

export default SingleTicketView;
