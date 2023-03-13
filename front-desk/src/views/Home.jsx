import React, { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import { BarcodeReaderContext } from "@oc/barcode-reader-context";
import { Box } from "@mui/material";
import { MemberContext } from "../context/MemberContext";
import AutoDeepLinkProvider from "../context/AutoDeepLinkContext";

const Home = () => {
	const [client, setClient] = useState();
	const { BarcodeReader } = useContext(BarcodeReaderContext);
	const NotifyUser = useContext(NotifyUserContext);
	const { Get } = useContext(ApiContext);
	const navigate = useNavigate();
	const { setMember } = useContext(MemberContext);
	const url = useLocation().pathname;
	const matches = useMatches();

	useEffect(() => {
		if (BarcodeReader.data) {
			const dni = BarcodeReader.data.split("@");
			try {
				if (dni.length > 2) {
					if (dni[0] === "") {
						setClient({
							Name: dni[5],
							Lastname: dni[4],
							LegalID: dni[1].replaceAll(" ", ""),
							Birthdate: dni[7],
						});
					} else {
						setClient({
							Name: dni[2],
							Lastname: dni[1],
							LegalID: dni[4],
							Birthdate: dni[6],
						});
					}
				} else {
					const reg = BarcodeReader.data.split("\r");
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
			Get(`/member/v1/search/${client.LegalID}`)
				.then(({ data }) => {
					if (
						typeof client.Name === Number ||
						client.Birthdate === undefined ||
						client.LegalID === undefined ||
						client.Name.length < 3 ||
						client.Lastname.length < 3
					) {
						NotifyUser.Warning(
							"No se pudo leer el documento, intente nuevamente por favor."
						);
						navigate(`/front-desk`);
					} else if (data.length === 0) {
						const info = new URLSearchParams(client).toString();
						setClient({});
						navigate(`/front-desk/add-member/${info}`);
					} else {
						setClient({});
						setMember(data[0]);
						console.log(data);

						navigate(`check-in/confirm`);
					}
				})
				.catch(async (err) => {
					NotifyUser.Error(
						`Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${err.request.status}).`
					);
				});
		}
		// eslint-disable-next-line
	}, [client]);

	return (
		<>
			<Navbar style={{ marginBot: "0" }} />
			<Box
				sx={{
					position: "fixed",
					top: "65px",
					bottom: "49px",
					left: 0,
					right: 0,

					overflow: "auto",
					backgroundColor: url !== "/front-desk" && "#eeeeeeb0",
				}}
			>
				<Outlet />
			</Box>
			<Footer />
		</>
	);
};

export default Home;
