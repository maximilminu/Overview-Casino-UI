import React, { useContext, useEffect, useState } from "react";
import {
	Paper,
	TableRow,
	TableHead,
	TableContainer,
	TableCell,
	TableBody,
	Table,
	Box,
	tableCellClasses,
	Button,
	styled,
	Grid,
	Chip,
	IconButton,
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import usePaginationContact from "../hook/usePaginationContact";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import {
	Outlet,
	useNavigate,
	useOutlet,
	useOutletContext,
} from "react-router-dom";
import Avatar from "../components/Avatar";

import { ApiContext } from "@oc/api-context";
import DescribeText from "../components/DescribeText";
import WithMoreList from "../components/WithMoreList";
import RequestAndRender from "../components/RequestAndRender";
import { AreaPermissionIcon } from "../utils/AreaPermissionIcon";
const style = {
	grid: {
		width: "100%",
		height: "100%",
		display: "flex",
		justifyContent: "center",

		alignItems: "flex-start",
		marginTop: "2rem",
	},
	tableContainer: {
		width: "80%",
		maxHeight: "95%",
		marginTop: "15px",
		display: "flex",
		flexDirection: "column",
	},
	tableCell: {
		fontWeight: "700",
		color: "secondary.light",
		textTransform: "uppercase",
	},
	avatar: {
		backgroundColor: "grey",
		width: 40,
		height: 40,
		fontSize: "15px",
	},
	chip: {
		backgroundColor: "primary.dark",
		color: "third.main",
		padding: ".8rem",
	},
	showMoreChip: {
		margin: 0.5,
		borderColor: "primary.dark",
		color: "primary.dark",
		cursor: "pointer",
	},
	withMoreList: {
		display: "flex ",
		flexWrap: "wrap",
		flexDirection: "row",
		alignContent: " center",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	withMoreItems: {
		width: "unset",
		paddingTop: "unset",
		paddingBottom: "unset",
		paddingLeft: "5px",
		paddingRight: "5px",
	},
	arrowBox: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: ".8rem",
	},
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.third.main,
		height: "50px",
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const itemsPerPage = 8;

export default function UsersList() {
	const { Get } = useContext(ApiContext);

	const { area, userSchema, userSearch } = useOutletContext();

	const navigate = useNavigate();
	const ifOutlet = useOutlet();
	const [usersToDisplay, setUsersToDisplay] = useState([]);

	const { currentPage, nextPage, prevPage, backToFirstPage } =
		usePaginationContact(itemsPerPage, userSearch);

	useEffect(() => {
		userPagination();

		//eslint-disable-next-line
	}, [userSearch, currentPage]);

	const userPagination = () => {
		if (userSearch) {
			if (userSearch.length <= itemsPerPage) {
				setUsersToDisplay([...userSearch]);
				backToFirstPage();
			}
			setUsersToDisplay(
				[...userSearch].slice(currentPage, currentPage + itemsPerPage)
			);
		}
	};

	const handleClick = (id) => {
		navigate(`view-user/${id}`);
	};

	const hasMoreUsersNextPage =
		userSearch && currentPage + 5 < userSearch.length;

	const hasMoreUsersPrevPage = userSearch && currentPage > 0;

	return ifOutlet ? (
		area && userSchema && <Outlet context={{ area, userSchema }} />
	) : (
		<Grid container sx={style.grid}>
			<TableContainer sx={style.tableContainer} component={Paper}>
				<Table size="small" stickyHeader>
					<TableHead>
						<TableRow>
							<StyledTableCell align="center" sx={style.tableCell}>
								Foto
							</StyledTableCell>
							<StyledTableCell align="center" sx={style.tableCell}>
								Nombre
							</StyledTableCell>
							<StyledTableCell align="center" sx={style.tableCell}>
								Rol
							</StyledTableCell>
							<StyledTableCell align="center" sx={style.tableCell}>
								Áreas
							</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{usersToDisplay &&
							usersToDisplay.map((currentUser) => (
								<TableRow
									key={currentUser.ID}
									sx={{
										"&:last-child td, &:last-child th": { border: 0 },
										" &:hover": {
											backgroundColor: "#e5e5e5",
										},
										cursor: "pointer",
										transition: "all .2s ease-in",
									}}
									onClick={() => handleClick(currentUser.ID)}
								>
									{/* {console.log("usersToDisplay", currentUser)} */}
									<TableCell align="left" component="th" scope="row">
										<Avatar
											size={50}
											sx={{ width: 50, height: 50 }}
											subject={currentUser}
										/>
									</TableCell>
									<TableCell sx={style.tableCell}>
										{currentUser.Name} {currentUser.Lastname}
									</TableCell>

									<TableCell sx={style.tableCell}>
										{currentUser.Role &&
											currentUser.Role.map((roleId) => (
												<DescribeText
													key={roleId}
													api={"user"}
													ID={roleId}
													preFixApi={"role"}
													style={{ fontSize: "16px" }}
													dependency={currentPage}
												/>
											))}
									</TableCell>

									<TableCell>
										<RequestAndRender
											requester={() =>
												Get(`/user/v1/by-id/${currentUser.ID}/related-areas`)
											}
											component={({ response }) =>
												response.data && response.data.length > 0 ? (
													<WithMoreList
														sx={style.withMoreList}
														itemsSx={style.withMoreItems}
														items={response.data}
														component={({ item }) => (
															<Chip
																variant="outlined"
																size="small"
																sx={style.chip}
																label={
																	<Box
																		sx={{
																			display: "flex",
																			flexDirection: "row",
																		}}
																	>
																		<DescribeText
																			api="area"
																			ID={item.AreaID}
																			sx={{
																				fontSize: "16px",
																				marginTop: "3px",
																			}}
																			withParentsTooltip
																		/>

																		{Object.keys(item)
																			.map((i, idx) => {
																				if (item[i] === true) {
																					return (
																						<AreaPermissionIcon
																							name={i}
																							key={idx}
																							value={true}
																							sx={{
																								color: "third.main",
																								margin: "2px 4px 0",
																							}}
																						/>
																					);
																				} else {
																					return null;
																				}
																			})
																			.filter(Boolean)}
																	</Box>
																}
															/>
														)}
														showMoreButtonComponent={(p) => (
															<IconButton
																onClick={p.onClick}
																variant="outlined"
																size="small"
																sx={style.showMoreChip}
															>
																<MoreHorizIcon sx={{ marginTop: "5px" }} />
															</IconButton>
														)}
														showLessButtonComponent={(p) => (
															<IconButton
																onClick={p.onClick}
																variant="outlined"
																size="small"
																sx={style.showMoreChip}
															>
																<CloseIcon sx={{ marginTop: "5px" }} />
															</IconButton>
														)}
													/>
												) : null
											}
										/>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
				<Box sx={style.arrowBox}>
					<Button onClick={prevPage} disabled={!hasMoreUsersPrevPage}>
						<ArrowBackIosIcon fontSize="small" />
					</Button>
					<Button onClick={nextPage} disabled={!hasMoreUsersNextPage}>
						<ArrowForwardIosIcon fontSize="small" />
					</Button>
				</Box>
			</TableContainer>
		</Grid>
	);
}
