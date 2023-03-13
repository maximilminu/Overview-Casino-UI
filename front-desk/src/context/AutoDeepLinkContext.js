import { createContext, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ApiContext } from "@oc/api-context";

export const AutoDeepLinkContext = createContext();

const AutoDeepLinkProvider = ({ children }) => {
	const location = useLocation();
	const { Post } = useContext(ApiContext);

	useEffect(() => {
		Post("/session/v1/public/AfterLoginGoTo", document.location.href);
		// eslint-disable-next-line
	}, [location]);

	return (
		<AutoDeepLinkContext.Provider value="">
			{children}
		</AutoDeepLinkContext.Provider>
	);
};

export default AutoDeepLinkProvider;
