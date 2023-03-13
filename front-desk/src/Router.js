import Contact from "./views/Contact";
import CheckInView from "./views/CheckInView";
import ModalConfirmCheckIn from "./views/ModalConfirmCheckIn";
import ViewMemberActivity from "./views/ViewMemberActivity";
import MembersList from "./views/MembersList";
import Home from "./views/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

function Router({ children }) {
  const pages = [
    {
      handle: {
        icon: <PersonAddAlt1Icon />,
        breadCrumsCaption: "Nuevo miembro",
      },
      path: "add-member/*",
      element: <Contact />,
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
    },
  ]);

  return <RouterProvider router={customRoutes} />;
}

export default Router;
