import React, { useContext, useLayoutEffect, useState } from "react";
import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Tree from "../components/Tree/Tree";
import Form from "../components/UserForm";
import dayjs from "dayjs";
import { ApiContext } from "@oc/api-context";

import uischema from "../uischema.json";
import { NotifyUserContext } from "@oc/notify-user-context";
import { useNavigate, useOutletContext } from "react-router-dom";

import { AreaPermissionIcon, icons } from "../utils/AreaPermissionIcon";

// Estilos
const style = {
	paper: {
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		// alignItems: "flex-start",
		padding: "3rem",
		gap: "1rem",
		backgroundColor: "third.main",
		marginTop: "20px",
		maxHeight: "80vh",
		alignItems: "center",
		borderRadius: "1rem",
	},
};

function AddNewUser() {
	const { area, userSchema } = useOutletContext();
	const { Post } = useContext(ApiContext);
	const [checkboxesValues, setCheckboxesValues] = useState(false);

	const [result, setResult] = useState();
	const [userData, setUserData] = useState({
		ContactMethods: [1],
	});

	const NotifyUser = useContext(NotifyUserContext);

	const navigate = useNavigate();

	const getAreaIds = (area) => {
		const ids = [];
		ids.push(area.ID);
		if (area.Childs) {
			for (const child of area.Childs) {
				ids.push(...getAreaIds(child));
			}
		}
		return ids;
	};

	useLayoutEffect(() => {
		const areaIds = getAreaIds(area);

		const cb = {};

		areaIds.forEach((a) => {
			cb[a] = {};

			icons.forEach((c) => (cb[a][c.name] = false));
		});
		setCheckboxesValues(cb);
		//eslint-disable-next-line
	}, [area]);

	const handleCheckboxClick = (areaId, checkboxName) => {
		return new Promise((resolve, reject) => {
			const val = !checkboxesValues[areaId][checkboxName];

			setCheckboxesValues((prevValues) => {
				prevValues[areaId][checkboxName] = val;
				return prevValues;
			});

			const checkedCheckboxes = {};
			//Para cada checkbox, se asigna su valor correspondiente de checkboxesValues[areaId][checkbox.name]
			icons.forEach((icon) => {
				checkedCheckboxes[icon.name] = checkboxesValues[areaId][icon.name];
			});
			// verifica si al menos uno de los valores de los checkboxes es true
			const checked = Object.values(checkedCheckboxes).some((value) => value);

			const obj = checked ? { [areaId]: checkedCheckboxes } : {};

			// Verificar si todos los checkboxes están en false
			const allFalse = Object.values(checkedCheckboxes).every(
				(value) => !value
			);
			if (allFalse) {
				setResult((prevResult) => {
					const { [areaId]: omitted, ...rest } = prevResult;
					return rest;
				});
			} else {
				setResult((prevResult) => ({ ...prevResult, ...obj }));
			}

			resolve(obj);
		});
	};
	const handleSubmit = () => {
		const emailRegex = /^\S+@\S+\.\S+$/;
		if (userData.Email && !emailRegex.test(userData.Email)) {
			NotifyUser.Warning("Ingrese un email válido.");
			return;
		}
		if (
			!validateRequiredField("Name", "Nombre") ||
			!validateRequiredField("Lastname", "Apellido") ||
			!validateRequiredField("LegalID", "Documento") ||
			!validateRequiredField("Birthdate", "Fecha de nacimiento") ||
			!validateRequiredField("Email", "Email") ||
			!validateRequiredField("Role", "Rol") ||
			!validateRequiredField("SignInID", "Nombre de usuario")
		) {
			return;
		}

		if (userData.Birthdate && dayjs(userData.Birthdate).isAfter(dayjs())) {
			NotifyUser.Warning("No se pueden ingresar fechas futuras.");
			return;
		}
		if (!userData.ContactMethods || userData.ContactMethods.length === 0) {
			NotifyUser.Warning("Debe agregar al menos un método de contacto");
			return;
		}
		const contactMethod = userData && userData.ContactMethods[0].Value;

		if (
			!contactMethod.Number ||
			contactMethod.Number === null ||
			(contactMethod.Number === "" && !contactMethod.Region) ||
			contactMethod.Region === null ||
			contactMethod.Region === ""
		) {
			NotifyUser.Warning("El campo de Número es obligatorio");
			return;
		}

		Post("/user/v1", {
			Name: userData.Name,
			Lastname: userData.Lastname,
			Email: userData.Email,
			Birthdate: userData.Birthdate,
			LegalID: userData.LegalID,
			Address: {
				Area: userData.Area,
				Country: userData.Contry,
				Line1: userData.Line1,
				Line2: userData.Line2,
				Location: userData.Location,
				Region: userData.Region,
				Zip: userData.Zip,
			},
			ContactMethods: userData.ContactMethods,
			Areas:
				result && Object.keys(result).length > 0
					? Object.keys(result).map((areaId) => ({
							ID: areaId,
							ReadInformation: result[areaId].ReadInformation,
							WriteInformation: result[areaId].WriteInformation,
							AccessToDoor: result[areaId].AccessToDoor,
							AccessToTerminal: result[areaId].AccessToTerminal,
					  }))
					: undefined,

			Role: userData.Role,
			MultipleTerminalAccess: !userData.TerminalAccess && false,
			SignInID: userData.SignInID,
		})
			.then(({ data }) => {
				setUserData({});

				navigate("/user-management");
				NotifyUser.Info("¡El usuario fue creado con éxito!");
			})
			.catch((error) => {
				if (error.response.status === 400) {
					NotifyUser.Warning("Complete los datos correctamente por favor.");
				} else if (error.response.status === 409) {
					NotifyUser.Warning(
						"Ya existe un usuario con el mismo email / nombre de usuario."
					);
				} else {
					NotifyUser.Error(
						`Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${error.response.status}).`
					);
				}
			});
	};

	const validateRequiredField = (fieldName, fieldLabel) => {
		if (!userData[fieldName]) {
			NotifyUser.Warning(`El campo '${fieldLabel}' es obligatorio`);
			return false;
		}
		return true;
	};

	const ItemActions = ({ item, depth, idx, data }) =>
		icons.map((icon, idx) => (
			<AreaPermissionIcon
				name={icon.name}
				key={idx}
				value={checkboxesValues[item.ID][icon.name]}
				onClick={() => {
					handleCheckboxClick(item.ID, icon.name);
				}}
			/>
		));

	return (
		<>
			{area && userSchema && checkboxesValues && (
				<Grid
					sx={{
						flexGrow: 1,
						height: "100%",
						width: "100%",
					}}
					container
					spacing={2}
				>
					<Grid
						item
						xs={12}
						md={10}
						lg={6}
						sx={{
							maxHeight: "80vh",
							"&.MuiGrid-item": {
								padding: { sm: "3rem", md: "1rem 2rem 2rem" },
								margin: { md: "0 5rem", lg: "unset" },
								display: "flex",
								justifyContent: "center",
							},
						}}
					>
						<Form
							userData={userData}
							setUserData={setUserData}
							handleSubmit={handleSubmit}
							schema={userSchema}
							uischema={uischema}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						md={11}
						lg={6}
						sx={{
							"&.MuiGrid-item": {
								padding: { sm: "4rem 3rem", md: "2rem ", lg: " 1rem" },
								margin: { md: "0 5rem", lg: "unset" },
								justifyContent: { md: "center", lg: "unset" },
							},
						}}
					>
						<Paper sx={style.paper}>
							<>
								<Typography variant="h5">Permisos de Usuario</Typography>
								{checkboxesValues && (
									<Tree
										data={area}
										onOpenCloseAll={null}
										rightActions={ItemActions}
									/>
								)}
							</>
						</Paper>
					</Grid>
				</Grid>
			)}
		</>
	);
}

export default AddNewUser;
