import React, { useMemo, useState, useContext, useEffect } from "react";
import {
	Button,
	Paper,
	Box,
	Typography,
	TextField,
	Backdrop,
} from "@mui/material";
import { JsonForms } from "@jsonforms/react";

import { materialRenderers } from "@jsonforms/material-renderers";
import { HardwareContext } from "@oc/hardware-context";
import LayoutArray from "./JsonForms/LayoutArray";

import ComponentInteractionChannel from "./JsonForms/ComponentInteractionChannel";

import {
	useNavigate,
	// Outlet,
	// useLocation,
	// useNavigate,
	// useOutlet,
	useParams,
} from "react-router-dom";

import EnrichmentInput from "./JsonForms/EnrichmentInput";
import EnrichmentDatePicker from "./JsonForms/EnrichmentDatePicker";
import ConfirmDialog from "./ConfirmDialog";

import { NotifyUserContext } from "@oc/notify-user-context";
import { ApiContext } from "@oc/api-context";
import EnrichmentAutocomplete from "./JsonForms/EnrichmentAutocomplete";
import Roulette from "./Spinner/Roulette";

function Form({
	userData,
	setUserData,
	handleSubmit,
	handleFormDataChange,
	schema,
	uischema,
}) {
	const { id } = useParams();

	const navigate = useNavigate();
	const Hardware = useContext(HardwareContext);
	const [motive, setMotive] = useState("");
	const [loading, setLoading] = useState(false);
	const { Post } = useContext(ApiContext);
	const roleOptions = schema.properties.Role.oneOf;

	const enrichmentInput = id
		? EnrichmentInput({ debounced: 3000 })
		: EnrichmentInput({ type: "create" });
	const enrichmentDatePicker = id
		? EnrichmentDatePicker({})
		: EnrichmentDatePicker({ type: "create" });

	const renderers = useMemo(
		() => {
			const enrichmentAutocomplete = EnrichmentAutocomplete({
				options: roleOptions,
			});
			return [
				...materialRenderers,
				LayoutArray,
				enrichmentAutocomplete,
				enrichmentDatePicker,
				enrichmentInput,
				ComponentInteractionChannel,
			];
		},
		// eslint-disable-next-line
		[]
	);

	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [userResetPass, setUserResetPass] = useState();

	const NotifyUser = useContext(NotifyUserContext);
	useEffect(() => {
		if (userResetPass) {
			handlePrint();
		}
		//eslint-disable-next-line
	}, [userResetPass]);

	const cancelChanges = (e) => {
		e.preventDefault();
		navigate("/user-management");
	};

	const handleMotive = (e) => {
		Post(`/user/v1/reboot-password`, {
			Reason: motive,
			Email: userData.Email,
		})
			.then(({ data }) => {
				const { Password, ExpiredAt } = data;
				setLoading(true);
				const fechaExp = new Date(ExpiredAt);

				const dia = fechaExp.getDate();
				const mes = fechaExp.toLocaleString("default", { month: "short" });
				const hora = fechaExp.getHours();
				const minutos = fechaExp.getMinutes();

				const parsedDate = `${dia}/${mes.toUpperCase()}, a las ${hora}:${minutos}`;

				setUserResetPass({ Password, ExpiredAt: parsedDate });

				setLoading(false);

				setShowConfirmDialog(false);
				setMotive("");
			})
			.catch((error) => {
				NotifyUser.Error("Ha ocurrido un error");
			});
	};

	const handlePrint = () => {
		loading ? (
			<Backdrop
				sx={{
					color: "#fff",
					zIndex: 0,
				}}
				open={true}
			>
				<Roulette />
			</Backdrop>
		) : (
			Hardware.Device.Printer.print(
				(printer) =>
					new Promise((finishPrint) => {
						printer
							.align("ct")
							.feed(1)
							.style("normal")
							.size(1, 1)

							.text("Tu clave temporal es:")
							.feed(1)
							.size(2, 2)
							.text(` ${userResetPass.Password}`)
							.feed(2)
							.size(1, 0)
							.text("Esta clave vence:")
							.feed(2)
							.size(1, 1)
							.text(` ${userResetPass.ExpiredAt}`)
							.feed(1);

						finishPrint();
					}),
				(onError) => {
					console.log("ERROR Asking for printer", onError);
					NotifyUser.Error("Problemas comunicando con la impresora.");
				}
			)
		);
	};

	return (
		<>
			<Paper sx={style.paper}>
				<Typography variant="h5" sx={{ margin: "-1rem 0 5rem 0" }}>
					Datos del Usuario
				</Typography>
				{schema && uischema && (
					<JsonForms
						schema={schema}
						uischema={uischema}
						data={userData}
						renderers={renderers}
						validationMode={"ValidateAndHide"}
						onChange={({ errors, data }) => {
							if (id) {
								handleFormDataChange({ userData: data, errors: errors });
							} else {
								setUserData(data);
							}
						}}
					/>
				)}

				{!id ? (
					<Box
						sx={{
							display: "flex",
							width: "100%",
							gap: "1rem",
						}}
					>
						<Button
							sx={{ width: "100%", position: "relative" }}
							variant="outlined"
							color="secondary"
							onClick={cancelChanges}
						>
							Cancelar
						</Button>
						<Button
							sx={{ width: "100%", position: "relative" }}
							variant="contained"
							color="primary"
							onClick={handleSubmit}
						>
							Agregar
						</Button>
					</Box>
				) : (
					<>
						<Box
							sx={{
								display: "flex",
								width: "100%",
								gap: "1rem",
							}}
						>
							<Button
								sx={{ width: "100%", position: "relative" }}
								variant={"contained"}
								color="secondary"
								onClick={() => {
									!Hardware.Device.Printer.status()
										? NotifyUser.Error("Problemas conectando con la impresora")
										: setShowConfirmDialog(true);
								}}
							>
								Nueva clave
							</Button>
						</Box>
						{/* <Button
						sx={{
							width: "100%",
							position: "relative",
							display: "flex",
							justifyContent: "center",
							textAlign: "center",
						}}
						variant="outlined"
						disabled={!readonly}
						// onClick={handleSubmit}
					>
						<Typography>Exportar permisos a nuevo perfil</Typography>
					</Button> */}
					</>
				)}

				{showConfirmDialog && (
					<ConfirmDialog
						open={showConfirmDialog}
						onClose={() => setShowConfirmDialog(false)}
						buttonClose={"Cancelar"}
						buttonConfirm={"Confirmar"}
						title={"¿Cuál motivo para el cambio de clave?"}
						onConfirm={handleMotive}
						disabled={motive.length < 10}
						content={
							<>
								<TextField
									autoFocus
									multiline
									rows={2}
									label="Motivo"
									margin="dense"
									id="name"
									onChange={(e) => setMotive(e.target.value)}
									fullWidth
									variant="filled"
									value={motive}
								/>
							</>
						}
					/>
				)}
			</Paper>
		</>
	);
}
//
//estilos
const style = {
	paper: {
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		alignItems: "center",
		padding: "3rem",
		gap: "1rem",
		backgroundColor: "third.main",
		marginBottom: "20px",
		marginTop: "20px",
		borderRadius: "1rem",
		height: "80vh",
	},
};

export default Form;
