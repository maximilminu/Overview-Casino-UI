import {
	Box,
	Paper,
	Table,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	styled,
	// tooltipClasses,
	tableCellClasses,
	TextField,
	Tooltip,
	TableBody,
	Typography,
	IconButton,
	InputAdornment,
	TableFooter,
	Zoom,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { Fragment, useContext, useEffect, useState } from "react";

import { FormatLocalCurrency } from "../utils/Intl";
import dayjs from "dayjs";

import { SearchOutlined } from "@mui/icons-material";
import CustomTablePagination from "./CustomTablePagination";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ConfigContext } from "@oc/config-context";

const style = {
	smallRow: {
		fontWeight: "700",
		color: "third.main",
		backgroundColor: "secondary.light",
		textTransform: "uppercase",
		margin: "0 auto",
		top: "70px",
		lineHeight: "15px",
	},
	rowOptionsHead: {
		backgroundColor: "primary.dark",
		margin: "0 auto",
		lineHeight: "15px",
		borderBottom: `1px solid third.main !important`,
	},
	rowOptionsFooter: {
		fontWeight: "700",
		color: "third.main",
		backgroundColor: "secondary.light",

		margin: "0 auto",
		lineHeight: "15px",
		textAlign: "end",
		padding: "0",
		width: "200rem",
	},
	cell: {
		fontWeight: "700",
		textTransform: "uppercase",
		margin: "0 auto",
		lineHeight: "15px",
		color: "secondary.dark",
	},
	dropCell: {
		fontWeight: "700",
		textTransform: "uppercase",
		margin: "0 auto",
		lineHeight: "15px",
		color: "primary.dark",
	},

	typography: {
		fontWeight: "700",
		fontSize: "12px",
		marginLeft: "25px",
		marginBottom: "10px",
		color: "third.main",
		textTransform: "uppercase",
	},
	message: {
		fontWeight: "700",
		fontSize: "12px",
		marginLeft: "25px",
		marginBottom: "10px",
		color: "secondary.dark",
		textTransform: "uppercase",
		paddingBottom: "10rem",
	},
	paper: {
		maxWidth: "700px",
		height: { xl: "100%", lg: "50%" },
		position: "relative",
		marginLeft: "auto",
		marginRight: "auto",
		padding: "30px",
		marginTop: "15px",
	},
	topTableCell: {
		color: "secondary.light",
		fontWeight: "700",
		textTransform: "uppercase",
		margin: "0 auto",
		lineHeight: "15px",
	},
};
const StyledTextfield = styled(TextField)(({ theme }) => ({
	width: "20%",

	".MuiInputBase-input": {
		WebkitTextFillColor: theme.palette.third.main,
	},
	".MuiInputLabel-root": {
		WebkitTextFillColor: theme.palette.third.main,
	},
	".MuiSvgIcon-root": {
		WebkitTextFillColor: theme.palette.third.main,
		color: theme.palette.third.main,
	},
}));
// const HtmlTooltip = styled(({ className, ...props }) => (
// 	<Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => ({
// 	[`& .${tooltipClasses.tooltip}`]: {
// 		backgroundColor: theme.palette.third.main,
// 		fontWeight: 600,
// 		color: theme.palette.secondary.main,
// 		maxWidth: 220,
// 		fontSize: "15px",
// 		border: "1px solid third.main",
// 	},
// }));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.third.main,
	},

	[`&.${tableCellClasses.body}`]: {
		fontSize: 15,
	},
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

const CounterTable = ({ data, handleDateChange, selectedDate }) => {
	const [groupedData, setGroupedData] = useState([]);
	const [machineFilter, setMachineFilter] = useState("");

	const [open, setOpen] = useState([]);

	const config = useContext(ConfigContext);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);

		setPage(0);
	};
	useEffect(() => {
		if (data) {
			const newData = data.reduce((acc, periodo) => {
				const existingIndex = acc.findIndex(
					(item) => item.MachineID === periodo.MachineID
				);
				if (existingIndex !== -1) {
					acc[existingIndex].Periods.push(...periodo.Periods);
				} else {
					acc.push(periodo);
				}
				return acc;
			}, []);
			setGroupedData(newData);
		}
	}, [data]);

	const handleToggle = (periodoID) => {
		if (open === periodoID) {
			setOpen(false);
		} else {
			setOpen(periodoID);
		}
	};

	const handleChangeMachineFilter = (event) => {
		const machineFilterValue = event.target.value;

		// Resetear la página actual a la primera página al cambiar el filtro de búsqueda
		setPage(0);

		// Actualizar el estado del filtro de búsqueda de máquina
		setMachineFilter(machineFilterValue);
	};

	const filteredData = groupedData.filter((periodo) =>
		periodo.MachineID.includes(machineFilter)
	);
	const startRowIndex = page * rowsPerPage;

	const endRowIndex = startRowIndex + rowsPerPage;

	const visibleData = filteredData.slice(startRowIndex, endRowIndex);

	const machineIDs = visibleData.map((item) => item.MachineID);
	const minMachineID = Math.min(...machineIDs)
		.toString()
		.slice(4);
	const maxMachineID = Math.max(...machineIDs)
		.toString()
		.slice(4);

	return (
		<>
			<Box sx={style.rowOptionsHead}>
				<CustomTablePagination
					rowsPerPage={rowsPerPage}
					page={page}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
					totalRows={groupedData.length}
					fontColor="third.main"
					selectColor="third.main"
				/>
			</Box>

			<TableContainer component={Paper} sx={{ height: "100%" }}>
				<Table stickyHeader size="small">
					<TableHead>
						<StyledTableRow>
							<StyledTableCell align="center" colSpan={15}>
								<Box
									sx={{
										width: "100%",
										display: "flex",
										justifyContent: "space-around",
										alignItems: "center",
									}}
								>
									<StyledTextfield
										id="outlined-basic"
										label="Buscar máquina"
										variant="filled"
										onChange={handleChangeMachineFilter}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<SearchOutlined />
												</InputAdornment>
											),
										}}
									/>
									<Typography variant="h4" gutterBottom sx={{ padding: "1px" }}>
										Contadores
									</Typography>
									<DatePicker
										label="Fecha"
										disableFuture
										value={selectedDate}
										onChange={handleDateChange}
										renderInput={(params) => (
											<StyledTextfield
												size="small"
												variant="filled"
												{...params}
											/>
										)}
									/>
								</Box>
							</StyledTableCell>
						</StyledTableRow>
						<StyledTableRow>
							<TableCell sx={style.smallRow} />

							<TableCell sx={style.smallRow} align="right">
								Máquina:
								{groupedData.length > 0 && `${minMachineID}-${maxMachineID}`}
							</TableCell>
							<TableCell sx={style.smallRow} align="center">
								Fecha
							</TableCell>
							<TableCell sx={style.smallRow} align="right">
								Jugadas
							</TableCell>
							<TableCell sx={style.smallRow} align="right">
								Coin In
							</TableCell>
							<TableCell sx={style.smallRow} align="right">
								Coin Out
							</TableCell>
							<TableCell sx={style.smallRow} align="right">
								Jackpot
							</TableCell>
							<TableCell sx={style.smallRow} colSpan={4} />
						</StyledTableRow>{" "}
					</TableHead>
					{/* TITULOS */}
					<TableBody>
						{groupedData.length > 0 ? (
							groupedData
								.filter((periodo) => periodo.MachineID.includes(machineFilter))

								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

								.map((periodo) => {
									const maxDate = Math.max(
										...periodo.Periods.map((period) => period.MetersTo.At)
									);
									const minDate = Math.min(
										...periodo.Periods.map((period) => period.MetersFrom.At)
									);

									return (
										<Fragment key={periodo.MachineID}>
											<StyledTableRow>
												<TableCell>
													<IconButton
														aria-label="expand row"
														size="small"
														onClick={() => handleToggle(periodo.MachineID)}
													>
														{open === periodo.MachineID ? (
															<KeyboardArrowDownIcon fontSize="small" />
														) : (
															<KeyboardArrowRightIcon fontSize="small" />
														)}
													</IconButton>
												</TableCell>
												<TableCell sx={style.cell} align="right">
													{periodo.MachineID}
												</TableCell>
												{/* MOSTRAR UNA SOLA FECHA Y HORA SI SON IGUALES * not working */}
												<TableCell sx={style.cell} align="right">
													{` ${dayjs(minDate).format(
														config.DisplayFormats.DateAndHours
													)} -  ${dayjs(maxDate).format(
														config.DisplayFormats.DateAndHours
													)} `}
												</TableCell>
												{/*! VALORES DELTA */}
												<TableCell sx={style.cell} align="right">
													{`${FormatLocalCurrency(
														periodo.Periods.reduce(
															(total, period) => total + period.Deltas.Games,
															0
														)
													)}`}
												</TableCell>
												<Tooltip
													TransitionComponent={Zoom}
													title={FormatLocalCurrency(
														periodo.Periods.reduce(
															(total, period) => total + period.Deltas.TotalIn,
															0
														)
													)}
													sx={{ cursor: "pointer" }}
												>
													<TableCell sx={style.cell} align="right">
														$
														{`${FormatLocalCurrency(
															periodo.Periods.reduce(
																(total, period) =>
																	total + period.Deltas.TotalIn,
																0
															) * periodo.DenominationValue
														)}`}
													</TableCell>
												</Tooltip>{" "}
												<Tooltip
													TransitionComponent={Zoom}
													title={FormatLocalCurrency(
														periodo.Periods.reduce(
															(total, period) => total + period.Deltas.TotalOut,
															0
														)
													)}
													sx={{ cursor: "pointer" }}
												>
													<TableCell sx={style.cell} align="right">
														$
														{`${FormatLocalCurrency(
															periodo.Periods.reduce(
																(total, period) =>
																	total + period.Deltas.TotalOut,
																0
															) * periodo.DenominationValue
														)}`}
													</TableCell>
												</Tooltip>{" "}
												<Tooltip
													TransitionComponent={Zoom}
													title={FormatLocalCurrency(
														periodo.Periods.reduce(
															(total, period) => total + period.Deltas.Jackpot,
															0
														)
													)}
													sx={{ cursor: "pointer" }}
												>
													<TableCell sx={style.cell} align="right">
														${" "}
														{`${FormatLocalCurrency(
															periodo.Periods.reduce(
																(total, period) =>
																	total + period.Deltas.Jackpot,
																0
															) * periodo.DenominationValue
														)}`}
													</TableCell>
												</Tooltip>
												<TableCell sx={style.cell} colSpan={4} />
											</StyledTableRow>
											{/* DROPDOWN */}
											{open === periodo.MachineID &&
												[...periodo.Periods]
													.sort(
														(a, b) =>
															new Date(a.MetersFrom.At) -
															new Date(b.MetersFrom.At)
													)
													.map((period, index, periods) => (
														<Fragment
															key={`${periodo.MachineID}-${period.MetersFrom.At}`}
														>
															{/* FROM */}
															<StyledTableRow
																sx={{
																	backgroundColor:
																		index % 2
																			? "#f1cfcf!important"
																			: " #f7ecc4 !important",
																}}
															>
																<TableCell colSpan={2} />
																<TableCell sx={style.dropCell} align="right">
																	{new Date(period.MetersFrom.At)
																		.toLocaleString("es-AR")
																		.replace(",", "")}
																</TableCell>
																{/* ACA */}
																<TableCell sx={style.dropCell} align="right">
																	{index > 0 && (
																		<Tooltip
																			TransitionComponent={Zoom}
																			title={FormatLocalCurrency(
																				period.MetersFrom.Games -
																					periods[index - 1].MetersTo.Games
																			)}
																			sx={{ cursor: "pointer" }}
																		>
																			<Box component="span">
																				{FormatLocalCurrency(
																					period.MetersFrom.Games
																				) || "Sin datos"}
																			</Box>
																		</Tooltip>
																	)}
																	{index === 0 &&
																		FormatLocalCurrency(
																			period.MetersFrom.Games
																		)}
																</TableCell>
																<TableCell sx={style.dropCell} align="right">
																	{index > 0 && (
																		<Tooltip
																			TransitionComponent={Zoom}
																			title={FormatLocalCurrency(
																				period.MetersFrom.TotalIn -
																					periods[index - 1].MetersTo.TotalIn
																			)}
																			sx={{ cursor: "pointer" }}
																		>
																			<Box component="span">
																				{FormatLocalCurrency(
																					period.MetersFrom.TotalIn
																				) || "Sin datos"}
																			</Box>
																		</Tooltip>
																	)}{" "}
																	{index === 0 &&
																		FormatLocalCurrency(
																			period.MetersFrom.TotalIn
																		)}
																</TableCell>
																<TableCell sx={style.dropCell} align="right">
																	{index > 0 && (
																		<Tooltip
																			TransitionComponent={Zoom}
																			title={FormatLocalCurrency(
																				period.MetersFrom.TotalOut -
																					periods[index - 1].MetersTo.TotalOut
																			)}
																			sx={{ cursor: "pointer" }}
																		>
																			<Box component="span">
																				{FormatLocalCurrency(
																					period.MetersFrom.TotalOut
																				) || "Sin datos"}
																			</Box>
																		</Tooltip>
																	)}{" "}
																	{index === 0 &&
																		FormatLocalCurrency(
																			period.MetersFrom.TotalOut
																		)}
																</TableCell>
																<TableCell sx={style.dropCell} align="right">
																	{index > 0 && (
																		<Tooltip
																			TransitionComponent={Zoom}
																			title={FormatLocalCurrency(
																				period.MetersFrom.Jackpot -
																					periods[index - 1].MetersTo.Jackpot
																			)}
																			sx={{ cursor: "pointer" }}
																		>
																			<Box component="span">
																				{FormatLocalCurrency(
																					period.MetersFrom.Jackpot
																				) || "Sin datos"}
																			</Box>
																		</Tooltip>
																	)}{" "}
																	{index === 0 &&
																		FormatLocalCurrency(
																			period.MetersFrom.Jackpot
																		)}
																</TableCell>
																<TableCell sx={style.dropCell} colSpan={4} />
															</StyledTableRow>
															{/* TO */}
															<StyledTableRow
																sx={{
																	backgroundColor:
																		index % 2
																			? "#f1cfcf!important"
																			: " #f7ecc4 !important",
																}}
															>
																<TableCell colSpan={2} />
																<TableCell sx={style.dropCell} align="right">
																	{new Date(period.MetersTo.At)
																		.toLocaleString("es-AR")
																		.replace(",", "")}
																</TableCell>
																<TableCell sx={style.dropCell} align="right">
																	<Tooltip
																		TransitionComponent={Zoom}
																		title={FormatLocalCurrency(
																			period.Deltas.Games
																		)}
																		sx={{ cursor: "pointer" }}
																	>
																		<Box component="span">
																			{FormatLocalCurrency(
																				period.MetersTo.Games
																			) || "Sin datos"}
																		</Box>
																	</Tooltip>
																</TableCell>
																<TableCell sx={style.dropCell} align="right">
																	{" "}
																	<Tooltip
																		TransitionComponent={Zoom}
																		title={FormatLocalCurrency(
																			period.Deltas.TotalIn
																		)}
																		sx={{ cursor: "pointer" }}
																	>
																		<Box component="span">
																			{FormatLocalCurrency(
																				period.MetersTo.TotalIn
																			) || "Sin datos"}
																		</Box>
																	</Tooltip>
																</TableCell>
																<TableCell sx={style.dropCell} align="right">
																	{" "}
																	<Tooltip
																		TransitionComponent={Zoom}
																		title={FormatLocalCurrency(
																			period.Deltas.TotalOut
																		)}
																		sx={{ cursor: "pointer" }}
																	>
																		<Box component="span">
																			{FormatLocalCurrency(
																				period.MetersTo.TotalOut
																			) || "Sin datos"}
																		</Box>
																	</Tooltip>
																</TableCell>
																<TableCell sx={style.dropCell} align="right">
																	{" "}
																	<Tooltip
																		TransitionComponent={Zoom}
																		title={FormatLocalCurrency(
																			period.Deltas.Jackpot
																		)}
																		sx={{ cursor: "pointer" }}
																	>
																		<Box component="span">
																			{FormatLocalCurrency(
																				period.MetersTo.Jackpot
																			) || "Sin datos"}
																		</Box>
																	</Tooltip>
																</TableCell>{" "}
																<TableCell sx={style.dropCell} colSpan={4} />
															</StyledTableRow>
														</Fragment>
													))}
										</Fragment>
									);
								})
						) : (
							<StyledTableRow>
								<TableCell
									colSpan={12}
									align="center"
									sx={{ paddingTop: "10rem" }}
								>
									<Typography sx={style.message}>
										No hay eventos para el día seleccionado
									</Typography>
								</TableCell>
							</StyledTableRow>
						)}
					</TableBody>{" "}
				</Table>
				{groupedData.length > 0 && (
					<TableFooter>
						<TableCell sx={style.rowOptionsFooter}>
							<CustomTablePagination
								rowsPerPage={rowsPerPage}
								page={page}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={handleChangeRowsPerPage}
								totalRows={groupedData.length}
								fontColor="third.main"
								selectColor="third.main"
							/>
						</TableCell>
					</TableFooter>
				)}
			</TableContainer>
		</>
	);
};

export default CounterTable;
