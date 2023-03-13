import Home from "./views/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PostAddIcon from "@mui/icons-material/PostAdd";
import TicketPrint from "./views/PrintView";
import Form from "./views/Form";

function Router({ children }) {
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
		},
	]);

	return <RouterProvider router={customRoutes} />;
}

export default Router;
