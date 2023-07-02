import {
	createBrowserRouter,
	RouterProvider,
	useRouteError,
} from "react-router-dom";

import Home from "./views/Home";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Table from "./views/Table";
import ErrorModal from "./components/ErrorModal";
import { useContext, useLayoutEffect, useState } from "react";
import { ApiContext } from "@oc/api-context";

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
		//eslint-disable-next-line
		let error = useRouteError();

		return <ErrorModal message={" Error de código, notifique al técnico"} />;
	}

	const pages = [
		{
			handle: {
				breadCrumsCaption: "Lista",
				icon: <FormatListBulletedIcon />,
			},
			path: "machine-list",
			element: <Table />,
		},
	];

	const customRoutes = createBrowserRouter([
		{
			path: "/machine-audit",
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
