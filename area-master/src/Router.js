import React, { useContext, useLayoutEffect, useState } from "react";
import { AccountTree } from "@mui/icons-material";
import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom";
import Home from "./views/Home";
import AreasList from "./views/AreasList";
import { ApiContext } from "@oc/api-context";
import AddBoxIcon from '@mui/icons-material/AddBox';
import ErrorModal from "./components/ErrorModal";

const Router = () => {
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
        icon: <AccountTree />,
        breadCrumsCaption: "Areas",
      },
      path: "all-areas/:id?",
      element: <AreasList />,
     
    },
    {
      handle: {
        icon: <AddBoxIcon />,
        breadCrumsCaption: "Nueva Área",
      },
      path: "new-area",
      element: <AreasList />,
     
    },
  ];

  const customRoutes = createBrowserRouter([
    {
      path: "/area-managment",
      element: <Home />,
      children: pages,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "*",
      element: <ErrorBoundary />,
    }
  ]);
  customRoutes.subscribe(autoDeepLink);
  return <RouterProvider router={customRoutes} />;
};

export default Router;
