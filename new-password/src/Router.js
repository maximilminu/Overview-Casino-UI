import {
	createBrowserRouter,
	RouterProvider,
	useRouteError,
} from "react-router-dom";

import Home from "./views/Home";
import LockResetIcon from "@mui/icons-material/LockReset";

import ErrorModal from "./components/ErrorModal";
import { useContext, useLayoutEffect, useState } from "react";
import { ApiContext } from "@oc/api-context";
import ChangePassword from "./views/ChangePassword";

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
				icon: <LockResetIcon />,
				breadCrumsCaption: "Cambiar clave",
			},
			path: "change-form",
			element: <ChangePassword />,
		},
		{
			handle: {},
			path: "reset-form",
			element: <ChangePassword />,
		},
	];

	const customRoutes = createBrowserRouter([
		{
			path: "/new-password",
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
