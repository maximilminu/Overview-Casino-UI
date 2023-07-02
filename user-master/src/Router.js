import {
	createBrowserRouter,
	RouterProvider,
	useRouteError,
} from "react-router-dom";
import AddNewUser from "./views/AddNewUser";
import UserManagement from "./views/UserManagement";
import UserList from "./views/UserList";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import UserView from "./views/UserVIew";

import ErrorModal from "./components/ErrorModal";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ApiContext } from "@oc/api-context";

function Router({ children }) {
	const [host, setHost] = useState("");
	const { Post } = useContext(ApiContext);

	useEffect(() => {
		const currentURL = window.location.href;
		const searchParam = "/user-list/";

		// Verificar si la URL contiene el parámetro userSearchParam
		if (currentURL.includes(searchParam)) {
			const newURL = currentURL.replace(searchParam, "/user-list/");
			window.history.replaceState(null, null, newURL);
		}
	}, []);

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
				breadCrumsCaption: "Crear nuevo usuario",
				icon: <PersonAddAlt1Icon />,
			},
			path: "add-user",
			element: <AddNewUser />,
		},
		{
			handle: {
				breadCrumsCaption: "Lista",
				icon: <FormatListBulletedIcon />,
				searchPlaceholder: "User",
				// searchParamName: "userSearchParam",
			},
			path: "user-list/:userListFilter",
			element: <UserList />,
			children: [
				{
					handle: {
						breadCrumsCaption: "Perfíl",
					},
					path: "view-user/:id/:userID?",
					element: <UserView open={true} />,
				},
			],
		},
	];

	const customRoutes = createBrowserRouter([
		{
			path: "/user-management",
			element: <UserManagement />,
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
