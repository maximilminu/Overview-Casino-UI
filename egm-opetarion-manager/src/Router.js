import Home from "./views/Home";
import {
	createBrowserRouter,
	RouterProvider,
	useRouteError,
} from "react-router-dom";
import PostAddIcon from "@mui/icons-material/PostAdd";
import TicketPrint from "./views/PrintView";

import Form from "./views/Form";
import { useContext, useLayoutEffect, useState } from "react";
import { ApiContext } from "@oc/api-context";

import ErrorModal from "./components/ErrorModal";

function Router({ children }) {
	const [host, setHost] = useState("");
	const { Post } = useContext(ApiContext);

	const saveDeepLink = (url) => {
		Post("/session/v1/public/AfterLoginGoTo", "", { body: url });
	};

	useLayoutEffect(() => {
		saveDeepLink(document.location.href);
		setHost(document.location.protocol + "//" + document.location.hostname);

		//eslint-disable-next-line
	}, []);

	const autoDeepLink = (state) => {
		saveDeepLink(host + state.location.pathname);
	};

	function ErrorBoundary() {
		let error = useRouteError();
		console.error(error);
		return <ErrorModal message={" Error de código, notifique al técnico"} />;
	}
	const pages = [
		{
			handle: {
				icon: <PostAddIcon />,
				breadCrumsCaption: "Validación de ticket",
			},
			path: "ticket-validate",
			element: <Form />,
			children: [
				{
					handle: {
						breadCrumsCaption: "Impresión de ticket",
					},
					path: "ticket-print",
					element: <TicketPrint />,
				},
			],
		},
	];
	const customRoutes = createBrowserRouter([
		{
			path: "/egm-operation-manager",
			element: <Home />,

			children: pages,
			errorElement: <ErrorBoundary />,
		},
		{
			path: "*",
			element: <ErrorBoundary />,
		},
	]);

	customRoutes.subscribe(autoDeepLink);

	return <RouterProvider router={customRoutes} />;
}

export default Router;
