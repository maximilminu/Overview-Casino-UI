import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom";
import AllDeviceList from "./views/AllDeviceList";
import DeviceDetailsLayout from "./views/DeviceDetailsLayout";
import Home from "./views/Home";
import { Devices } from "@mui/icons-material";
import VerificationCodeDialog from "./components/VerificationCodeDialog";
import { useContext, useLayoutEffect, useState } from "react";
import { ApiContext } from "@oc/api-context";
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
        icon: <Devices />,
        defaultParams: {
          type: 1,
        },
        breadCrumsCaption: "Dispositivos",
      },
      path: "list/:type",
      element: <AllDeviceList />,
      children: [
        {
          handle: {
            breadCrumsCaption: "Código de verificación",
          },
          path: "add-new-device",
          element: <VerificationCodeDialog />,
        },
        {
          handle: {
            breadCrumsCaption: "Detalle",
          },
          path: "setup/:id",
          element: <DeviceDetailsLayout />,
        },
      ],
    },


  


    // {
    //   handle: {
    //     icon: <Assignment />,
    //     breadCrumsCaption: "Lista de roles",
    //   },
    //   path: "all-roles",
    //   element: <RoleList />,
    // },
  ];

  const customRoutes = createBrowserRouter([
    {
      path: "/network-devices",
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
