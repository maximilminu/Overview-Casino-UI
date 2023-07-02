import TicketUI from "../components/TicketUI";
import { Container } from "@mui/system";

import { ApiContext } from "../components/context/ApiContext";
import { useContext, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NotifyUserContext } from "@oc/notify-user-context";

const style = {
	container: {
		width: "100vw",
		height: "100vh",
		backgroundColor: "rgb(61 61 61 / 90%)",
	},
};

function Visit() {
	const NotifyUser = useContext(NotifyUserContext);
	const { Get } = useContext(ApiContext);
	const [data, setData] = useState({});
	const { id } = useParams();

	useLayoutEffect(() => {
		Get(`/public-visit/v1/by-id/${id}`)
			.then(({ data }) => {
				setData(data);
				console.log(data);
			})
			.catch((error) => {
				console.error(error);
				NotifyUser.Error(
					`Problema con el servicio de registro de visita ${error.response.status}`
				);
			});

		//eslint-disable-next-line
	}, [id]);

	return (
		<Container maxWidth={false} sx={style.container}>
			<TicketUI
				Name={data.Name}
				Area={data.Area}
				CreatedAt={data.CreatedAt}
				PrintedAt={data.PrintedAt}
			/>
		</Container>
	);
}

export default Visit;
