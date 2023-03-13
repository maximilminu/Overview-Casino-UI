// crear el contexto para la actualizacion de los devices
import { createContext, useState } from "react";

export const TicketDataCOntext = createContext();

const TicketDataProvider = ({ children }) => {
	const initialValues = {};
	const [ticket, setTicket] = useState(initialValues);

	return (
		<TicketDataCOntext.Provider
			value={{
				ticket,
				setTicket,
			}}
		>
			{children}
		</TicketDataCOntext.Provider>
	);
};

export default TicketDataProvider;
