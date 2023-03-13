import {
	Button,
	CircularProgress,
	Container,
	Divider,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { BarcodeReaderContext } from "@oc/barcode-reader-context";
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import { MemberContext } from "../context/MemberContext";
import { LoadingButton } from "@mui/lab";
import { Outlet, useNavigate, useOutlet } from "react-router-dom";

export default function CheckInView() {
	const [loading, setLoading] = useState();
	const [client, setClient] = useState();
	const { BarcodeReader } = useContext(BarcodeReaderContext);
	const { Get } = useContext(ApiContext);
	const navigate = useNavigate();
	const [dni, setDni] = useState();
	const NotifyUser = useContext(NotifyUserContext);
	const { setMember, member } = useContext(MemberContext);
	const ifOutlet = useOutlet();

	const [disabledButton, setDisabledButton] = useState(true);
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
						navigate(`/front-desk/add-member/${info}`);
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

						navigate(`confirm`);
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

	const getUserWithDni = (dni) => {
		setLoading(true);
		if (dni) {
			Get(`/member/v1/search/${dni}`)
				.then(({ data }) => {
					if (data.length === 0) {
						navigate(`/front-desk/add-member/`);
						setClient({});
					} else {
						setMember(data[0]);
						setClient({});
					}
				})
				.catch(async (err) => {
					NotifyUser.Error(
						`Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${err.request.status}).`
					);
				});
		}
	};

	useEffect(() => {
		if (member?.Name) {
			setLoading(false);
			navigate(`confirm`);
		}
		// eslint-disable-next-line
	}, [member]);

	return ifOutlet ? (
		<Outlet />
	) : (
		<Container
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				marginTop: "30px",
			}}
		>
			<Paper
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					width: { xl: "40%", lg: "40%", md: "40%", sm: "80%" },
					padding: "50px",
				}}
			>
				<Typography variant="h4" sx={{ color: "secondary.main" }} gutterBottom>
					Check In
				</Typography>
				<Divider />
				<TextField
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							if (!disabledButton) {
								getUserWithDni(e.target.value);
							}
						}
					}}
					label="DNI"
					autoComplete="off"
					onChange={(e) => {
						if (e.target.value.length >= 7) {
							setDisabledButton(false);
							setDni(e.target.value);
						}
					}}
					variant="outlined"
					sx={{
						input: {
							color: "black",
							borderColor: "black",
						},
						label: {
							color: "black",
						},
						margin: "2rem",
					}}
				/>
				{loading ? (
					<LoadingButton>
						<CircularProgress color="inherit" />
					</LoadingButton>
				) : (
					<Button
						variant="contained"
						disabled={disabledButton}
						color="primary"
						width="100%"
						onClick={() => getUserWithDni(dni)}
					>
						Buscar
					</Button>
				)}
			</Paper>
		</Container>
	);
}
