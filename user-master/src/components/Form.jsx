import React, {
	useState,
	useCallback,
} from "react";
import { Button, Paper, Box, Typography } from "@mui/material";
import { JsonForms } from "@jsonforms/react";
import schema from "../schema";
import uischema from "../uischema.json";
import { materialRenderers } from "@jsonforms/material-renderers";
import { debounce } from "lodash";
import LayoutArray from "../components/JsonForms/LayoutArray";
import ComponentAvatar from "../components/JsonForms/ComponentAvatar";
import ComponentInteractionChannel from "../components/JsonForms/ComponentInteractionChannel";
import DatePicker from "./JsonForms/DatePicker"
import {
	// Outlet,
	// useLocation,
	// useNavigate,
	// useOutlet,
	useParams,
} from "react-router-dom";
import IosShareIcon from '@mui/icons-material/IosShare';

function Form({ permissions }) {
	const [savedMemberInfo, setSavedMemberInfo] = useState({});
	// const { Get, Post, Patch } = useContext(ApiContext);
	const { id } = useParams();
	const initialData = {};
	// const NotifyUser = useContext(NotifyUserContext);
	// const [loading, setLoading] = useState(false);
	// const navigate = useNavigate();
	const renderers = [
		...materialRenderers,
		DatePicker,
		LayoutArray,
		ComponentAvatar,
		ComponentInteractionChannel,
	];

	// If there's NO ID (existing member to EDIT), leaves blank to fill by hand.
	const [data, setData] = useState(id ? {} : initialData);

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	const saveChanges = (e) => {
		e.preventDefault();
	}

	const cancelChanges = (e) => {
		e.preventDefault();
	}

	// eslint-disable-next-line
	const handleFormDataChange = useCallback(
		debounce(({ data, errors }) => { 

			
		}, 3000)
	, []);

	return (
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
				<Box
					sx={{
						display: "flex",
						width: "100%",
						gap: "1rem"
					}}
				>
					<Button
						sx={{ width: "100%", position: "relative", }}
						variant="outlined"
						color="secondary"
						onClick={cancelChanges}
					>
						Cancelar
					</Button>
					<Button
						sx={{ width: "100%", position: "relative" }}
						variant="outlined"
						color="primary"
						onClick={handleSubmit}
					>
						Agregar
					</Button>
				</Box>
			)}
			<Button
				sx={{ width: "100%", position: "relative", display: "flex", justifyContent: "space-between", }}
				variant="outlined"
				// color="primary"
				onClick={handleSubmit}
			>
				<div style={{ width: "24px" }} />
				<Typography>
					Exportar permisos a nuevo perfil
				</Typography>
				<IosShareIcon sx={{ alignSelf: "flex-end"}} />
			</Button>
		</Paper>

	);
}

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
		height: "80vh"
	}
};

export default Form;
