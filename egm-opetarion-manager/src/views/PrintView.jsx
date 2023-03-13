import { Container } from "@mui/system";
import React from "react";
import TicketUI from "../components/TicketUI";
import PrintTicket from "../components/PrintTicket";

const TicketFound = () => {
	const style = {
		container: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
		},

		paper: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
			height: "250px",
			width: "400px",
			margin: "2rem",
			elevation: "2",
			padding: "40px",
			backgroundColor: "third.main",
			color: "primary.main",
		},
		confirmBox: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
			minHeight: "0vh",
		},
	};

	const formatShortMonth = (data) => {
		let date = new Date(data);
		let options = {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		};
		return date.toLocaleDateString("es-AR", options);
	};

	const parseDate = (dateString) => {
		let dateComponents = dateString.split(" ");

		let day = dateComponents[0];
		let month = dateComponents[2]?.substring(0, 3).toUpperCase();
		let year = dateComponents[4];
		let time = dateComponents[5];

		return day + "/" + month + "/" + year + " " + time;
	};

	return (
		<>
			<Container sx={style.container}>
				<TicketUI formatShortMonth={formatShortMonth} parseDate={parseDate} />
				<PrintTicket
					formatShortMonth={formatShortMonth}
					parseDate={parseDate}
				/>
			</Container>
		</>
	);
};

export default TicketFound;
