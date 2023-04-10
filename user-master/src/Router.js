import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddNewUser from "./views/AddNewUser"
import Home from "./views/Home"
import UsersList from "./views/UsersList";

function Router() {
	const pages = [
		// {
		// 	handle: {
		// 		// icon: <PersonAddAlt1Icon />,
		// 		breadCrumsCaption: "Agregar Usuario",
		// 	},
		// 	path: "add-user",
		// 	element: <AddNewUser />,
		// },
		// {
		// 	handle: {
		// 		// icon: <PersonAddAlt1Icon />,
		// 		breadCrumsCaption: "Lista de usuarios",
		// 	},
		// 	path: "users-list",
		// 	element: <UsersList />,
		// },
		{
			handle: {
				breadCrumsCaption: "Lista",
			},
			path: "user-list",
			element: <UsersList open={true} />,
			children: [
				{
					handle: {
						breadCrumsCaption: "Detalle",
					},
					path: "view-user/:id",
					element: <div />,
					children: [
						{
							handle: {
								breadCrumsCaption: "Edición",
							},
							path: "edition",
							element: <AddNewUser />,
						},
					],
				},
			],
		},
		{
			handle: {
				breadCrumsCaption: "Crear nuevo usuario",
			},
			path: "add-user",
			element: <AddNewUser />,
		},
	];

	const customRoutes = createBrowserRouter([
		{
			path: "/user-master",
			element: <Home />,
			children: pages,
		},
	]);

	return <RouterProvider router={customRoutes} />;
}

export default Router;