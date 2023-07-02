import { useState, useContext, useLayoutEffect } from "react";
import EditMember from "./views/EditMember";
import CheckInView from "./views/CheckInView";
import ModalConfirmCheckIn from "./views/ModalConfirmCheckIn";
import ViewSingleMember from "./views/ViewSingleMember";
import MembersList from "./views/MembersList";
import Home from "./views/Home";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { ApiContext } from "@oc/api-context";
import NewMember from "./views/NewMember";

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
          path: "confirm/:memberID?",
          element: <ModalConfirmCheckIn />,
        },
      ],
    },

    {
      handle: {
        breadCrumsCaption: "Lista ",
        searchPlaceholder: "Miembro",
        searchParamName: "memberSearchText",
      },
      path: "member-list/:memberSearchText?",
      element: <MembersList open={true} />,

      children: [
        {
          handle: {
            breadCrumsCaption: "Detalle",
          },
          path: "view-single-member/:id/:visitID?",
          element: <ViewSingleMember />,
          children: [
            {
              handle: {
                breadCrumsCaption: "Edición",
              },
              path: "edition",
              element: <EditMember />,
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
