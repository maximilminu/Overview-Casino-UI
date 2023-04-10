import TicketUI from "../components/TicketUI";
import { Container } from "@mui/system";
import { Backdrop } from "@mui/material";
import { ApiContext } from "../components/context/ApiContext";
import { useContext, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";

const style = {
	container: {
		width: "100vw",
		height: "100vh",
	},
};

// /api/

function Visit() {
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
			});

		//eslint-disable-next-line
	}, [id]);

	return (
		<Backdrop
			sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
			open={true}
		>
			<Container sx={style.container}>
				<TicketUI
					ID={data.ID}
					Name={data.Name}
					Area={data.Area}
					CreatedAt={data.CreatedAt}
					PrintedAt={data.PrintedAt}
				/>
			</Container>
		</Backdrop>
	);
}

export default Visit;
