import { Grid } from "@mui/material";
import React, { useContext, useLayoutEffect, useState } from "react";
import PasswordForm from "../components/PasswordForm";
import { ApiContext } from "@oc/api-context";
import { useOutletContext, Outlet } from "react-router";
import { NotifyUserContext } from "@oc/notify-user-context";
import jwt_decode from "jwt-decode";
import { ConfigContext } from "@oc/config-context";
import { useLocation } from "react-router";

const ChangePassword = () => {
	const url = useLocation().pathname;
	const [valid, setValid] = useState({});
	const [data, setData] = useState({});
	const { Post } = useContext(ApiContext);
	const ifOutlet = useOutletContext();
	const NotifyUser = useContext(NotifyUserContext);
	const { AccessToken } = useContext(ApiContext);
	const token = jwt_decode(AccessToken).Profile.DefaultUrlPath;
	const config = useContext(ConfigContext);
	const [loadingButton, setLoadingButton] = useState(false);
	const [disabledInputs, setDisabledInputs] = useState(false);

	useLayoutEffect(() => {
		if (url) {
			if (url.includes("/reset-form")) {
				setValid({ NewPassword: false, ConfirmPassword: false });
			} else {
				setValid({
					OldPassword: false,
					NewPassword: false,
					ConfirmPassword: false,
				});
			}
		}
	}, [url]);

	const handleChange = (e) => {
		e.preventDefault();
		const pattern = new RegExp(config.PasswordFormat.Pattern, "i");
		setData({ ...data, [e.target.id]: e.target.value });
		setValid({ ...valid, [e.target.id]: pattern.test(e.target.value) });
	};

	const hashFunctions = {
		SHA512: async (pass) => {
			const msgUint8 = new TextEncoder().encode(pass); // encode as (utf-8) Uint8Array
			const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8); // hash the message
			const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
			const hashHex = hashArray
				.map((b) => b.toString(16).padStart(2, "0"))
				.join(""); // convert bytes to hex string
			return hashHex;
		},
		plain: async (pass) => {
			return pass;
		},
	};

	const handleSubmit = async (e) => {
		setDisabledInputs(true);
		e.preventDefault();
		const OldPassword = await hashFunctions[config.PasswordFormat.HashFunction](
			data.OldPassword
		);
		const NewPassword = await hashFunctions[config.PasswordFormat.HashFunction](
			data.NewPassword
		);
		const ConfirmPassword = await hashFunctions[
			config.PasswordFormat.HashFunction
		](data.ConfirmPassword);

		if (url && url.includes("reset-form")) {
			Post(`/user/v1/reset-password`, {
				NewPassword: NewPassword,
				ConfirmPassword: ConfirmPassword,
			})
				.then(({ data }) => {
					NotifyUser.Success("La clave fue cambiada con éxito");
					setLoadingButton(true);
					setLoadingButton(true);
					setTimeout(() => {
						window.location.href = token;
						setData({});
						// setLoadingButton(false);
					}, 3000);
				})
				.catch((error) => {
					setDisabledInputs(false);
					error.response.json().then((errorData) => {
						if (errorData.ERROR === "CONFIRM_PASSWORD_INVALID") {
							NotifyUser.Warning("Las contraseñas no coinciden");
						} else if (errorData.ERROR === "CANNOT_USE_SAME_PASSWORD") {
							NotifyUser.Warning(
								"La nueva contraseña no puede ser igual a la actual"
							);
						} else {
							NotifyUser.Error(
								`Problemas con el servicio de cambio de clave. Notifique al servicio técnicos (${error.response.status}).`
							);
						}
					});
					NotifyUser.Error(
						`Problemas con el servicio de cambio de clave. Notifique al servicio técnicos (${error.response.status}).`
					);
				});
		} else {
			Post(`/user/v1/change-password`, {
				OldPassword: OldPassword,
				NewPassword: NewPassword,
				ConfirmPassword: ConfirmPassword,
			})
				.then(() => {
					NotifyUser.Success("La clave fue cambiada con éxito");
					setLoadingButton(true);
					setLoadingButton(true);
					setTimeout(() => {
						window.location.href = token;
						setData({});
						// setLoadingButton(false);
					}, 3000);
				})
				.catch((error) => {
					setDisabledInputs(false);
					error.response.json().then((errorData) => {
						if (errorData.ERROR === "CONFIRM_PASSWORD_INVALID") {
							NotifyUser.Warning("Las contraseñas no coinciden");
							return;
						} else if (errorData.ERROR === "CANNOT_USE_SAME_PASSWORD") {
							NotifyUser.Warning(
								"La nueva contraseña no puede ser igual a la actual"
							);
							return;
						} else if (errorData.ERROR === "INVALID_OLD_PASSWORD") {
							NotifyUser.Warning("La contraseña actual no es correcta");
							return;
						} else {
							NotifyUser.Error(
								`Problemas con el servicio de cambio de clave. Notifique al servicio técnicos(${error.response.status}).`
							);
						}
					});
					NotifyUser.Error(
						`Problemas con el servicio de cambio de clave. Notifique al servicio técnicos (${error.response.status}).`
					);
				});
		}
	};

	const validate = () => {
		return (
			Object.values(valid).every((v) => v === true) &&
			Object.values(data).every((v) => v.length >= 4)
		);
	};

	return (
		<>
			{ifOutlet ? (
				<Outlet />
			) : (
				<>
					<Grid container sx={style.grid}>
						<PasswordForm
							title={"Cambiar clave"}
							firstLabel={"Contraseña actual"}
							firstID={url.includes("reset-form") ? null : "OldPassword"}
							secondID={"NewPassword"}
							thirdID={"ConfirmPassword"}
							secondLabel={"Nueva contraseña"}
							thirdLabel={"Confirmar contraseña"}
							message={
								config && config.PasswordFormat && config.PasswordFormat.Message
							}
							handleChange={handleChange}
							handleSubmit={handleSubmit}
							validate={validate(data)}
							loading={loadingButton}
							disabled={disabledInputs}
						/>
					</Grid>
				</>
			)}
		</>
	);
};

const style = {
	grid: {
		width: "100%",
		height: "100%",
		flexDirection: "column",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
};

export default ChangePassword;
