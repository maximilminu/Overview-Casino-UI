import { Button, Container, Paper } from "@mui/material";
import React, {
	useLayoutEffect,
	useState,
	useCallback,
	useEffect,
} from "react";
import ComponentInteractionChannel from "../components/JsonForms/ComponentInteractionChannel";
import schema from "../schema.json";
import uischema from "../uischema.json";
import { JsonForms } from "@jsonforms/react";
import { materialRenderers } from "@jsonforms/material-renderers";
import LayoutArray from "../components/JsonForms/LayoutArray";
import ComponentAvatar from "../components/JsonForms/ComponentAvatar";
import { NotifyUserContext } from "@oc/notify-user-context";
import { useContext } from "react";
import { ApiContext } from "@oc/api-context";
import {
	Outlet,
	useLocation,
	useNavigate,
	useOutlet,
	useParams,
} from "react-router-dom";
import { MemberContext } from "../context/MemberContext";
import { debounce } from "lodash";
import * as jsonpatch from "fast-json-patch/index.mjs";
import { CleanHands } from "@mui/icons-material";

//renderizado de json form
const renderers = [
	...materialRenderers,
	LayoutArray,
	ComponentAvatar,
	ComponentInteractionChannel,
];

//estilos
const style = {
	paper: {
		padding: "50px",
		display: "flex",
		gap: "20px",
		backgroundColor: "third.main",
		marginBottom: "20px",
		marginTop: "20px",
		justifyContent: "center",
		flexDirection: "column",
		alignItems: "center",
	},
	container: {
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
	},
};

const Contact = () => {
	const ifOutlet = useOutlet();

	const url = useLocation().pathname.slice(23);
	const currentUrl = useLocation().pathname;
	const urlParams = new URLSearchParams(url);
	const NotifyUser = useContext(NotifyUserContext);
	const initialData = {};
	const navigate = useNavigate();
	const { Get, Post, Patch } = useContext(ApiContext);
	const { id } = useParams();
	const { setMember } = useContext(MemberContext);
	const [savedMemberInfo, setSavedMemberInfo] = useState({});
	const [data, setData] = useState({});

	const fixAndSetData = (data) => {
		setSavedMemberInfo(data);

		// Parsea los numeros en formato string a number.
		data.ContactMethods?.map((contactInfo) => {
			if (typeof contactInfo.Value === "object") {
				contactInfo.Value.Number = +contactInfo.Value.Number;
			}
			return true;
		});

		// Parsea la FECHA de cumpleaños
		const dateConvert = new Date(data.Birthdate)
			.toLocaleString("es-AR")
			.split(",")[0];
		data.Birthdate = dateConvert;
		setData(data);
	};

	// Carga el miembro a editar y guarda un estado del miembro guardado en base de datos para luego comparar con la edicion.
	useLayoutEffect(() => {
		// const dataFetchedRef = useRef(false);
		let userEmpty = true;
		const nameCapitalizer = () => {
			const nameCapitalizeArray = urlParams
				?.getAll("Name")
				.toString()
				.split(" ");
			const arrayCapitalized = nameCapitalizeArray.map((name) => {
				return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
			});
			return arrayCapitalized.join(" ");
		};

		const lastnameCapitalizer = () => {
			const lastnameCapitalizeArray = urlParams
				?.getAll("Lastname")
				.toString()
				.split(" ");
			const arrayCapitalized = lastnameCapitalizeArray.map((lastname) => {
				return (
					lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase()
				);
			});
			return arrayCapitalized.join(" ");
		};

		// Get info by SCANNER.
		const newMember = {
			Name: nameCapitalizer(),
			Lastname: lastnameCapitalizer(),
			LegalID: urlParams?.getAll("LegalID").toString(),
			Birthdate: urlParams?.getAll("Birthdate").toString(),
		};

		if (id) {
			Get(`/member/v1/by-id/${id}?t=${Date.now()}`)
				.then(({ data }) => {
					if (!data) {
						NotifyUser.Error("Miembro no encontrado");
						return;
					}
					fixAndSetData(data);
				})

				.catch((err) => {
					NotifyUser.Error("Error: ", err);
				});
		}
	}, [currentUrl]);

	//IF setTimeout da TRUE despues de un segundo OR cambia el Focus de campo, guarda el usuario. Tambien deberia guardarlo si la URL/ruta es cambiada
	//Por otro lado el FOCUS cambia el color del campo que esta siendo editado.
	// eslint-disable-next-line
	const handleFormDataChange = useCallback(
		debounce(({ data, errors }) => {
			const patch = jsonpatch.compare(savedMemberInfo, data);
			console.log("PATCH", patch);
			// OBVIA los errores de metodos de contacto. Incompatibilidad en parseo, la informacion se guarda igual de manera correcta por mas de que marque error.
			const filteredErrors = errors.filter(
				(err) => err.instancePath.indexOf("ContactMethod") < 0
			);
			try {
				if (filteredErrors.length === 0 && patch.length) {
					// PARSEA la info de cumpleaños
					for (let i = 0; i < patch.length; i++) {
						if (patch[i].path === "/Birthdate") {
							const date = patch[i].value.split("/");

							const parseado = Date.parse(`${date[2]}-${date[1]}-${date[0]}`);
							patch[i].value = parseado;
						}
					}

					Patch(`/member/v1/${id}`, patch)
						.then(({ data }) => {
							fixAndSetData(data);
							NotifyUser.Success("El campo fue actualizado con éxito");
						})
						.catch((error) => {
							if (error.response.status === 404) {
								console.log("CATCH Error 404 ", error.response.status);
							}

							if (error.response.status === 400) {
								NotifyUser.Warning(
									"Complete los datos correctamente por favor."
								);
							} else if (
								error.response.status === 409 ||
								error.response.status === 424
							) {
								NotifyUser.Warning(
									"Ya existe un usuario con el mismo documento/email."
								);
							} else {
								NotifyUser.Error(
									`Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${error.response.status}).`
								);
							}
						});
				}
			} catch (error) {
				NotifyUser.Error("Error ", error);
			}

			if (filteredErrors.length > 0) {
				NotifyUser.Error("Error ", filteredErrors);
			}
		}, 3000),
		[savedMemberInfo]
	);

	const handleSubmit = () => {
		const myDate = data.Birthdate?.split("/");
		const parseado = Date.parse(`${myDate[2]}-${myDate[1]}-${myDate[0]}`);
		const base64 = data.Avatar;
		Post("/member/v1", {
			Name: data.Name,
			Lastname: data.Lastname,
			Email: data.Email,
			Birthdate: parseado,
			LegalID: data.LegalID,
			Area: data.Area,
			ContactMethods: data.ContactMethods,
		})
			.then(({ data }) => {
				setData({});
				setMember(data);
				if (base64 !== undefined) {
					fetch(base64)
						.then((data) => data.blob())
						.then((blob) => {
							const fd = new FormData();
							const file = new File([blob], `avatar${data.Name}.jpg`, {
								type: "image/jpeg",
							});
							fd.append("file", file);
							Post(`/storage/avatar/${data.ID}`, fd)
								.then(({ data }) => {
									NotifyUser.Success("Imagen subida correctamente");
									navigate(`/front-desk/check-in/confirm`);
								})
								.catch((error) => {
									console.log("ERROR");
									if (error.request.status === 400) {
										NotifyUser.Warning(
											"no se ha podido guardar la imagen",
											error
										);
									}
								});
						});
				}

				// NUNCA ENTRA ACA
			})
			.catch((error) => {
				if (error.response.status === 400) {
					NotifyUser.Warning("Complete los datos correctamente por favor.");
				} else if (error.response.status === 409) {
					NotifyUser.Warning(
						"Ya existe un usuario con el mismo documento/email."
					);
				} else {
					NotifyUser.Error(
						`Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${error.response.status}).`
					);
				}
			});
	};

	return ifOutlet ? (
		<Outlet />
	) : (
		<Container sx={style.container}>
			<Paper sx={style.paper}>
				<JsonForms
					schema={schema}
					uischema={uischema}
					data={data}
					renderers={renderers}
					onChange={
						id
							? handleFormDataChange
							: ({ errors, data }) => {
									setData(data);
							  }
					}
				/>
				{!id && (
					<Button
						sx={{ width: "100%", marginTop: "-20px", position: "relative" }}
						variant="outlined"
						color="primary"
						onClick={handleSubmit}
					>
						Agregar
					</Button>
				)}
			</Paper>
		</Container>
	);
};

export default Contact;
