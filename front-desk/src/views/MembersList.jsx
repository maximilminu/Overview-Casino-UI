import React, { useContext, useEffect, useState } from "react";
import {
	Container,
	Backdrop,
	Paper,
	TableRow,
	TableHead,
	TableContainer,
	TableCell,
	TableBody,
	Table,
	Box,
	Button,
} from "@mui/material";

import { NotifyUserContext } from "@oc/notify-user-context";
import { ApiContext } from "@oc/api-context";
import usePaginationContact from "../hook/usePaginationContact";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Roulette from "../components/Spinner/Roulette";
import { useLayoutEffect } from "react";
import { BarcodeReaderContext } from "@oc/barcode-reader-context";
import { MemberContext } from "../context/MemberContext";
import { Outlet, useNavigate, useOutlet, useParams } from "react-router-dom";
import Avatar from "../components/Avatar";
import { useLocation } from "react-router-dom";

const style = {
	tableCell: {
		fontWeight: "700",
		color: "rgb(123, 128, 154)",
		textTransform: "uppercase",
	},
	avatar: {
		backgroundColor: "grey",
		width: 40,
		height: 40,
		fontSize: "15px",
	},
};

export default function MembersList() {
	const [client, setClient] = useState();
	const { BarcodeReader } = useContext(BarcodeReaderContext);
	const { Get } = useContext(ApiContext);
	const [memberSearch, setMemberSearch] = useState();
	const { setMember } = useContext(MemberContext);
	const { param } = useParams();
	const navigate = useNavigate();
	const ifOutlet = useOutlet();
	const NotifyUser = useContext(NotifyUserContext);
	const currentRouter = useLocation().pathname;
	const arrUrl = currentRouter.split("/");
	const { currentPage, nextPage, prevPage } = usePaginationContact(
		10,
		memberSearch
	);

	useEffect(() => {
		if (param === "") {
			navigate("/front-desk");
			return;
		}
		Get(`/member/v1/search/${param}`)
			.then(({ data }) => {
				if (data?.length === 1) {
					navigate(
						`/front-desk/member-list/${param}/view-single-member/${data[0].ID}`
					);
					return;
				}
				setMemberSearch(data);
			})
			.catch(async (err) => {
				NotifyUser.Error(
					`Problemas con la lista de miembros. Notifique al servicio técnicos (${err.request.status}).`
				);
			});
		// eslint-disable-next-line
	}, [param]);

	const handleClick = (id) => {
		navigate(`view-single-member/${id}`);
	};

	const filteredMemberSearch = () => {
		if (memberSearch) {
			if (memberSearch?.length <= 10) return memberSearch.slice(0, 10);
			return memberSearch.slice(currentPage, currentPage + 10);
		}
	};

	useEffect(() => {
		if (BarcodeReader.data) {
			const dni = BarcodeReader.data?.split("@");
			try {
				if (dni.length > 2) {
					setClient({
						Name: dni[2],
						Lastname: dni[1],
						LegalID: dni[4],
						Birthdate: dni[6],
					});
				} else {
					const reg = BarcodeReader.data?.split("\r");
					if (reg.length === 20) {
						setClient({
							Name: reg[3],
							Lastname: reg[4],
							LegalID: reg[1],
							Birthdate: reg[5],
							AreaReg8: reg[12],
						});
					}
				}
			} catch {
				NotifyUser.Warning("No se pudo leer el documento.");
			}
			BarcodeReader.clear();
		}
		// eslint-disable-next-line
	}, [BarcodeReader.data]);

	useEffect(() => {
		if (client?.LegalID) {
			Get(`/member/v1/search/${client?.LegalID}`)
				.then(({ data }) => {
					if (data.length === 0) {
						const info = new URLSearchParams(client).toString();
						setClient({});
						navigate(`/front-desk/add-user/${info}`);
					} else if (
						client.Birthdate === undefined ||
						client.LegalID === undefined
					) {
						NotifyUser.Warning(
							"No se pudo escanear el documento, intente nuevamente por favor"
						);
						navigate(`/front-desk/check-in`);
					} else {
						setClient({});
						setMember(data[0]);
						navigate(`/front-desk/confirm-check-in/`);
					}
				})
				.catch((err) => {
					NotifyUser.Error(
						`Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${err?.request.status}).`
					);
				});
		}
		// eslint-disable-next-line
	}, [client]);

	return ifOutlet ? (
		<Outlet />
	) : (
		<>
			{memberSearch ? (
				<Container
					sx={{
						marginTop: "30px",

						padding: ".7rem",
						width: "80%",
					}}
				>
					<TableContainer
						component={Paper}
						sx={{ padding: "1rem", marginBottom: "20px" }}
					>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell sx={style.tableCell}>Foto</TableCell>
									<TableCell sx={style.tableCell}>Nombre</TableCell>
									<TableCell sx={style.tableCell}>Dni</TableCell>
									<TableCell sx={style.tableCell}>Área</TableCell>
									{/* <TableCell sx={style.tableCell}>Info</TableCell> */}
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredMemberSearch()?.map((currentMember, index) => (
									<TableRow
										key={index}
										sx={{
											"&:last-child td, &:last-child th": { border: 0 },
											" &:hover": {
												backgroundColor: "#e5e5e5",
											},
											cursor: "pointer",
											transition: "all .2s ease-in",
										}}
										onClick={() => handleClick(currentMember.ID)}
									>
										{/* <Link> */}
										<TableCell align="left" component="th" scope="row">
											{/* <Avatar src={currentMember.Avatar} sx={style.avatar}>
                    {currentMember.Name.slice(0, 1)}
                    {currentMember.Lastname.slice(0, 1)}
                  </Avatar> */}
											<Avatar
												sx={{ width: 50, height: 50 }}
												subject={currentMember}
											/>
										</TableCell>
										<TableCell align="left" component="th" scope="row">
											{currentMember.Name} {currentMember.Lastname}
										</TableCell>
										<TableCell align="left" component="th" scope="row">
											{currentMember.LegalID}
										</TableCell>
										<TableCell align="left" component="th" scope="row">
											{currentMember.Area}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Button onClick={prevPage}>
								<ArrowBackIosIcon fontSize="small" />
							</Button>
							<Button onClick={nextPage}>
								<ArrowForwardIosIcon fontSize="small" />
							</Button>
						</Box>
					</TableContainer>
				</Container>
			) : (
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
		</>
	);
}
