import Home from "./views/Home";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import ComponentsView from "./views/ComponentsView";
import "dayjs/locale/es-mx";
import { useContext } from "react";
import { useState } from "react";
import { ApiContext } from "@oc/api-context";
import { useLayoutEffect } from "react";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import ErrorModal from "./components/ErrorModal";
import InsertPageBreakIcon from "@mui/icons-material/InsertPageBreak";

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

  const pages = [
    {
      handle: {
        icon: <FiberNewIcon />,
        breadCrumsCaption: "Crear Ticket",
      },
      path: "new-insert",
      element: <ComponentsView />,
    },
    {
      handle: {
        icon: <InsertPageBreakIcon />,
        breadCrumsCaption: "Registrar Ticket",
      },
      path: "pre-insert",
      element: <ComponentsView />,
    },
  ];

  function ErrorBoundary() {
    let error = useRouteError();
    console.error(error);
    return <ErrorModal message={" Error de código, notifique al técnico"} />;
  }

  const customRoutes = createBrowserRouter([
    {
      path: "/ticket",
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
