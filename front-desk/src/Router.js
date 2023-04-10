import { useState, useContext, useLayoutEffect } from "react";
import Contact from "./views/EditMember";
import CheckInView from "./views/CheckInView";
import ModalConfirmCheckIn from "./views/ModalConfirmCheckIn";
import ViewMemberActivity from "./views/ViewMemberActivity";
import MembersList from "./views/MembersList";
import Home from "./views/Home";
import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { ApiContext } from "@oc/api-context";
import NewMember from "./views/NewMember";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

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
    return <Box sx={{
        width: '30vw',
        height: '50vh',
        marginLeft: '35vw',
        marginTop: '20vh',
        backgroundColor: 'grey',
        padding: '20px'
      }}>
        <Typography variant="h3">Hemos detectado un error en el código del sistema, por favor reporte al servicio técnico. Gracias.</Typography>
      </Box>
  }

	const pages = [
		{
			handle: {
				icon: <PersonAddAlt1Icon />,
				breadCrumsCaption: "Nuevo miembro",
			},
			path: "add-member/*",
			element: <NewMember />,
		},
		{
			handle: {
				icon: <CheckCircleIcon />,
				breadCrumsCaption: "Check-in",
			},
			path: "check-in",
			element: <CheckInView />,
			children: [
				{
					handle: {
						breadCrumsCaption: "Confirmar Check-in",
					},
					path: "confirm",
					element: <ModalConfirmCheckIn />,
				},
			],
		},

		{
			handle: {
				breadCrumsCaption: "Lista",
			},
			path: "member-list/:param",
			element: <MembersList open={true} />,
			children: [
				{
					handle: {
						breadCrumsCaption: "Detalle",
					},
					path: "view-single-member/:id",
					element: <ViewMemberActivity />,
					children: [
						{
							handle: {
								breadCrumsCaption: "Edición",
							},
							path: "edition",
							element: <Contact />,
						},
					],
				},
			],
		},
	];
	const customRoutes = createBrowserRouter([
		{
			path: "/front-desk",
			element: <Home />,
			children: pages,
      errorElement: <ErrorBoundary/>
		},
	]);

	customRoutes.subscribe(autoDeepLink);

	return <RouterProvider router={customRoutes} />;
}

export default Router;
