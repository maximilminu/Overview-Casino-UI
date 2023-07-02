import React, { useContext, useLayoutEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom";
import Home from "./views/Home";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
// import AreasList from "./views/AreasList";
// import SingleAreaView from "./views/SingleAreaView";
import { ApiContext } from "@oc/api-context";
import ErrorModal from "./components/ErrorModal";
import RegisterEGM from "./views/RegisterEGM";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BulkTicket from "./views/BulkTicket";
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import ManualAdjustment from "./views/treasury/ManualAdjustment";
import { useLocation } from "react-router";

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

    const url = useLocation()
	console.log(url)
    let error = useRouteError();
    console.error(error);
    return <ErrorModal message={" Error de código, notifique al técnico"} />;
  }

  const pages = [
    {
      handle: {
        icon: <AppRegistrationIcon />,
        breadCrumsCaption: "Registro",
      },
      path: "register",
      element: <RegisterEGM />,
    },
    {
      handle: {
        icon: <ReceiptLongIcon />,
        breadCrumsCaption: "Creación de tickets",
      },
      path: "create-tickets",
      element: <BulkTicket />,
    },
    {
      handle: {
        icon: <BuildCircleIcon />,
        breadCrumsCaption: "Ajuste Manual",
      },
      path: "manual-adjustment",
      element: <ManualAdjustment />,
    },
    // {
    //   handle: {
    //     icon: <CurrencyExchangeIcon />,
    //     breadCrumsCaption: "Enviar",
    //   },
    //   path: "send-tokens",
    //   element: <SendTokens />,
    // },
    // {
    //   handle: {
    //     icon: <ReceiptLongIcon />,
    //     breadCrumsCaption: "Creación de tickets",
    //   },
    //   path: "create-tickets",
    //   element: <BulkTicket />,
    // },
  ];

  const customRoutes = createBrowserRouter([
    {
      path: "/egm-drop",
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
