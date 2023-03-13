import './App.css';
import Home from "./views/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ComponentsView from "./views/ComponentsView"
import 'dayjs/locale/es-mx';

function Router({ children }) {
	const pages = [
		{
			handle: {
				// icon: <PersonAddAlt1Icon />,
				breadCrumsCaption: "Crear Ticket",
			},
			path: "new-insert",
			element: <ComponentsView />,
		},
		{
			handle: {
				// icon: <PersonAddAlt1Icon />,
			  	breadCrumsCaption: "Registrar Ticket",
			},
			path: "pre-insert",
			element: <ComponentsView />,
		},
	];

	const customRoutes = createBrowserRouter([
	  {
		path: "/ticket",
		element: <Home />,
		children: pages,
	  },
	]);
  
	return <RouterProvider router={customRoutes} />;
}
  
  export default Router;
