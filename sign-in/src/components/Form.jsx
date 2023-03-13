import { TextField, IconButton, InputAdornment } from "@mui/material";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useForm } from "react-hook-form";
import { getSessionValue, login, logout } from "../services/api";
import SubmitButton from "./SubmitButton";
import ErrorAlert from "./ErrorAlert";
import useLocalStorage from "react-use-localstorage";
import "../index.css";
import { useContext } from "react";
import { ConfigContext } from "../context/ConfigProvider";
import jwt_decode from "jwt-decode";

const Form = () => {
	const config = useContext(ConfigContext);
	const location = useLocation();
	const [accessToken, setAccessToken] = useLocalStorage("AccessToken");
	const [, setExpiresAt] = useLocalStorage("ExpiresAt");
	const [, setRefreshToken] = useLocalStorage("RefreshToken");
	const [tokenType, setTokenType] = useLocalStorage("TokenType");
	const [showErrorToast, setShowErrorToast] = useState(false);
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false); // loading button
	const [disableSignInID, setDisableSignInID] = useState(false);

	const style = {
		inputField: {
			".MuiInputBase-input.Mui-disabled": {
				WebkitTextFillColor: "rgb(150, 150, 150)",
				color: "rgb()",
			},
			".MuiInputLabel-root.Mui-disabled": {
				WebkitTextFillColor: "rgb(150, 150, 150)",
			},
			// minWidth: "50%",
			width: "100%",
			// "& .MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled ": {
			// "& .MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled": {
			// 	color: "red",
			// },
			// },

			marginBottom: "10px",
			label: {
				color: "white",
			},
			input: {
				color: "third.main",
				borderColor: "third.main",
			},
		},
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

	const onSubmit = async (data) => {
		const Password = await hashFunctions[config.SignInPassword.HashFunction](
			data.Password
		);
		try {
			const { access_token, expires_in, refresh_token, token_type } =
				await login({ Email: data.SignInId, Password });
			setIsLoading(true);
			setAccessToken(access_token);
			setExpiresAt(Date.now() + (expires_in - 60) * 1000);
			setRefreshToken(refresh_token);
			setTokenType(token_type);
			try {
				// TODO read from private value as well
				const redirectUrl = await getSessionValue("public", "AfterLoginGoTo");
				window.location.href = redirectUrl;
			} catch {
				// if an error occurs, redirect to '/'
				window.location.href = "/";
			}
		} catch (error) {
			if (error.message === "401") {
				setIsLoading(false);
				setShowErrorToast(true);
				setTimeout(() => {
					setShowErrorToast(false);
				}, 3000);
				setError(["Credenciales inválidas"]);
			} else {
				setIsLoading(false);
				setShowErrorToast(true);
				setError([
					`Problemas con el servicio de autenticación. Avise al soporte técnico ${error.message}`,
				]);
			}
		}
		return;
	};

	const [values, setValues] = useState({
		password: "",
		showPassword: false,
	});

	const handleClickMouseOver = () => {
		setTimeout(handleClickMouseOut, 1500);
		setValues({
			...values,
			showPassword: true,
		});
	};

	const handleClickMouseOut = () => {
		setValues({
			...values,
			showPassword: false,
		});
	};

	const token = accessToken;
	const decoded = token && jwt_decode(token);
	const signInID = decoded.SignInID;
	const [signInIDToken, setSignInIDToken] = useState(signInID);

	const {
		register,
		handleSubmit,
		watch,

		formState: { errors },
	} = useForm({
		mode: "onChange",
		defaultValues: { SignInId: signInIDToken },
	});

	useEffect(() => {
		if (location.search === "?showLastSignInID" && accessToken) {
			setSignInIDToken(signInID);
			console.log(signInIDToken);
		} else if (location.search === "?forceLastSignInID" && accessToken) {
			setSignInIDToken(signInID);
			setDisableSignInID(true);
		}
	}, [signInIDToken]);

	useLayoutEffect(() => {
		logout({ tokenType, accessToken });
		setAccessToken("");
		setExpiresAt("");
		setRefreshToken("");
		setTokenType("");
		// eslint-disable-next-line
	}, []);

	return (
		<form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
			<TextField
				{...register(`SignInId`, {
					required: true,
					pattern: {
						value: new RegExp(config.SignInId.Pattern, "i"),
					},
				})}
				id="input-with-sx"
				label={config.SignInId.Label}
				variant="outlined"
				focused
				// value={signInIDToken}
				disabled={isLoading || disableSignInID}
				autoFocus={disableSignInID}
				autoComplete="off"
				color="third"
				required
				sx={style.inputField}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<AccountCircle
								sx={{
									color: disableSignInID ? "rgb(150, 150, 150)" : "third.main",
								}}
							/>
						</InputAdornment>
					),
				}}
			/>
			{/* PASSWORD INPUT */}
			<TextField
				{...register("Password", {
					required: true,
					pattern: {
						value: new RegExp(config.SignInPassword.Pattern, "gm"),
					},
				})}
				disabled={isLoading}
				autoFocus={!disableSignInID}
				color="third"
				focused
				required
				type={values.showPassword ? "text" : "password"}
				label="Contraseña"
				sx={style.inputField}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							{isLoading ? (
								<VisibilityOff sx={{ color: "third.main" }} />
							) : (
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickMouseOver}
									edge="end"
								>
									{values.showPassword ? (
										<VisibilityOff sx={{ color: "third.main" }} />
									) : (
										<Visibility sx={{ color: "third.main" }} />
									)}
								</IconButton>
							)}
						</InputAdornment>
					),
				}}
			/>

			<SubmitButton
				type="submit"
				watch={watch}
				errors={errors}
				isLoading={isLoading}
				handleSubmit={handleSubmit(onSubmit)}
				
			/>

			{showErrorToast && <ErrorAlert message={error[0]} />}
		</form>
	);
};

export default Form;
