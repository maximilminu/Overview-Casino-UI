import React, { useContext, useLayoutEffect, useState } from "react";
import { IconButton, Paper, Tooltip, Zoom } from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Tree from "../components/Tree/Tree";
import Form from "../components/UserForm";
import * as jsonpatch from "fast-json-patch/index.mjs";
import dayjs from "dayjs";
import { Backdrop } from "@mui/material";
import { ApiContext } from "@oc/api-context";
import Roulette from "../components/Spinner/Roulette";
import uischema from "../uischema.json";
import { useEffect } from "react";
import { NotifyUserContext } from "@oc/notify-user-context";

import { useOutletContext, useParams } from "react-router-dom";

import { icons } from "../utils/AreaPermissionIcon";
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

function UserView() {
	const { area, userSchema } = useOutletContext();
	const { Patch, Post } = useContext(ApiContext);
	const { Get } = useContext(ApiContext);
	const [checkboxesValues, setCheckboxesValues] = useState(false);
	const [, setResult] = useState();
	const [savedUserInfo, setSavedUserInfo] = useState({});
	const [userData, setUserData] = useState({});
	const NotifyUser = useContext(NotifyUserContext);
	const [loading, setLoading] = useState(true);
	const { id } = useParams();

	useLayoutEffect(() => {
		if (id) {
			const areaIds = getAreaIds(area);

			const cb = {};

			Get(`/user/v1/by-id/${id}`)
				.then(({ data }) => {
					setUserData(data);
				})
				.catch((error) => {
					NotifyUser.Error(
						`Error para obtener los datos del usuario, (${error.request.status})`
					);
				})
				.finally(() => setLoading(false));
			Get(`/user/v1/by-id/${id}/areas`)
				.then(({ data }) => {
					areaIds.forEach((a) => {
						cb[a] = {};

						icons.forEach((c) => {
							cb[a][c.name] =
								((data.filter((ua) => ua.AreaID === a) || [{}])[0] || {})[
									c.name
								] || false;
						});
					});

					setCheckboxesValues(cb);
				})
				.catch((error) => {
					NotifyUser.Error(
						`Error para obtener los permisos del usuario, (${error})`
					);
				})
				.finally(() => setLoading(false));
		}

		//eslint-disable-next-line
	}, [id]);

	useEffect(() => {
		if (userData.ID) {
			fixAndSetData(userData);
		}

		//eslint-disable-next-line
	}, [userData]);

	const fixAndSetData = (data) => {
		setSavedUserInfo(data);

		// valida si el campo ContactMethods está presente y es un array
		if (Array.isArray(data.ContactMethods)) {
			data.ContactMethods.forEach((contactInfo) => {
				if (typeof contactInfo.Value === "object") {
					if (contactInfo.Value === null) {
						contactInfo.Value = {};
					}

					if (typeof contactInfo.Value.Number === "string") {
						contactInfo.Value.Number = parseInt(contactInfo.Value.Number, 10);
					}
				}
			});
		}

		setUserData(data);
	};

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

	const handleFormDataChange = ({ userData }) => {
		const patch = jsonpatch.compare(savedUserInfo, userData);
		const emailRegex = /^\S+@\S+\.\S+$/;
		try {
			if (patch.length) {
				if (!userData.Name || userData.Name.length === 0) {
					NotifyUser.Warning(`El Nombre es obligatorio`);
					return;
				}
				if (!userData.Lastname || userData.Lastname.length === 0) {
					NotifyUser.Warning(`El Apellido es obligatorio`);
					return;
				}
				if (!userData.LegalID || userData.LegalID.length === 0) {
					NotifyUser.Warning(`El campo DNI es obligatorio`);
					return;
				}
				if (!userData.Email || userData.Email.length === 0) {
					NotifyUser.Warning(`El campo Email es obligatorio`);
					return;
				}
				if (userData.Email && !emailRegex.test(userData.Email)) {
					NotifyUser.Warning("Ingrese un email válido.");
					return;
				}

				if (!userData.SignInID || userData.SignInID.length === 0) {
					NotifyUser.Warning(`El Nombre de Usuario es obligatorio`);
					return;
				}
				if (
					!userData.Role ||
					typeof userData.Role === "undefined" ||
					userData.Role.length === 0
				) {
					NotifyUser.Warning(`El campo Rol es obligatorio`);
					return;
				}
				if (!userData.Birthdate || userData.Birthdate.length === null) {
					NotifyUser.Warning("La fecha de nacimiento es obligatoria");
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

				const contactMethod = userData.ContactMethods[0].Value;

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

				const detectRoleChange = (newRoles, oldRoles) => {
					const addedRoles =
						newRoles &&
						newRoles.filter((role) => oldRoles && !oldRoles.includes(role));
					const removedRoles =
						oldRoles &&
						oldRoles.filter((role) => newRoles && !newRoles.includes(role));

					return {
						addedRoles,
						removedRoles,
					};
				};
				const { addedRoles, removedRoles } = detectRoleChange(
					userData.Role,
					savedUserInfo.Role
				);

				if (userData.Role !== savedUserInfo.Role) {
					if (addedRoles.length > 0) {
						const roleID = addedRoles;
						// Realizar la solicitud POST solo cuando se modifica el campo de autocompletado
						Post(`/user/v1/by-id/${id}/push-role/${roleID}`)
							.then((data) => {
								NotifyUser.Success("El rol fue actualizado con éxito");
								savedUserInfo.Role = userData.Role; // Actualizar los roles almacenados
							})
							.catch((error) => {
								console.log(error);
							});
					} else if (removedRoles && removedRoles.length > 0) {
						// Se removieron roles
						const roleID = removedRoles; // Suponiendo que solo se remueve un rol

						Post(`/user/v1/by-id/${id}/delete-role/${roleID}`)
							.then((data) => {
								NotifyUser.Success("El rol fue eliminado con éxito");
								savedUserInfo.Role = userData.Role; // Actualizar los roles almacenados
							})
							.catch((error) => {
								console.log(error);
							});
					}
				} else {
					Patch(`/user/v1/by-id/edit/${id}`, patch)
						.then(({ data }) => {
							// Restaurar el valor original de userData.Role
							data.Role = userData.Role;

							data.ID = id;
							setUserData(data); // actualiza userData con los nuevos datos
							fixAndSetData(data);
							NotifyUser.Success("El campo fue actualizado con éxito");
						})
						.catch((error) => {
							console.log(error);
						});
				}
			}
		} catch (error) {
			console.log(error, "ERROR");
		}
	};

	const handleCheckboxClick = (areaId, checkboxName) => {
		return new Promise((resolve, reject) => {
			const val = !checkboxesValues[areaId][checkboxName];

			setCheckboxesValues((prevValues) => {
				// Se accede a la propiedad específica del checkbox dentro del área correspondiente y se le asigna el nuevo valor val
				prevValues[areaId][checkboxName] = val;
				return prevValues;
			});

			const checkedCheckboxes = {};
			// Para cada checkbox, se asigna su valor correspondiente de checkboxesValues[areaId][checkbox.name]
			icons.forEach((icon) => {
				checkedCheckboxes[icon.name] = checkboxesValues[areaId][icon.name];
			});

			// Verifica si al menos uno de los valores de los checkboxes es true
			const checked = Object.values(checkedCheckboxes).some((value) => value);

			const obj = checked ? { [areaId]: checkedCheckboxes } : {};

			// Verificar si todos los checkboxes están en false
			const allFalse = Object.values(checkedCheckboxes).every(
				(value) => !value
			);
			if (allFalse) {
				setResult((prevResult) => {
					if (!prevResult) {
						return {};
					}
					const { [areaId]: omitted, ...rest } = prevResult;
					return rest;
				});
			} else {
				setResult((prevResult) => ({ ...prevResult, ...obj }));
			}

			resolve(obj);

			// Construir el objeto de permisos para enviar en el cuerpo de la solicitud
			const permissionsObj = {};
			icons.forEach((icon) => {
				permissionsObj[icon.name] = checkboxesValues[areaId][icon.name];
			});

			// Actualizar el permiso
			Post("/user/v1/edit-permissions/", {
				UserID: id,
				AreaID: areaId,
				...permissionsObj,
			})
				.then(({ data }) => {
					if (data.data) {
						// Actualizar el estado del checkbox
						setCheckboxesValues((prevValues) => ({
							...prevValues,
							[areaId]: {
								...prevValues[areaId],
								[checkboxName]: val,
							},
						}));
					}
					NotifyUser.Success("Permiso actualizado correctamente.");
				})
				.catch((error) => {
					NotifyUser.Error(
						`Error al actualizar el permiso (${error.response.status}).`
					);
				});
		});
	};
	const ItemCheckbox = ({ item, checkbox }) => {
		const [val, setVal] = useState(checkboxesValues[item.ID][checkbox.name]);
		const label = val ? checkbox.tooltipChecked : checkbox.tooltipUnchecked;

		return (
			<Tooltip TransitionComponent={Zoom} title={label}>
				<IconButton
					aria-label={label}
					id={item.ID}
					onClick={() => {
						handleCheckboxClick(item.ID, checkbox.name).then((v) => setVal(v));
					}}
				>
					{val ? (
						<checkbox.iconChecked sx={{ color: "fourth.main" }} />
					) : (
						<checkbox.iconUnchecked sx={{ color: "primary.dark" }} />
					)}
				</IconButton>
			</Tooltip>
		);
	};

	const ItemActions = ({ item, depth, idx, data }) =>
		icons.map((icon) => (
			<ItemCheckbox
				key={`${item.ID}-${icon.name}`}
				item={item}
				checkbox={icon}
			/>
		));

	return (
		<>
			{loading ? (
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
				area &&
				userSchema &&
				checkboxesValues && (
					<Grid container spacing={2}>
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
								schema={userSchema}
								uischema={uischema}
								handleFormDataChange={handleFormDataChange}
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
							{/* width: { xl: "40%", lg: "40%", md: "40%", sm: "90%" }, */}
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
				)
			)}
		</>
	);
}

export default UserView;
