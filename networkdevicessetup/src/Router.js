import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoleList from "./components/Lists/RoleList";
import AllDeviceList from "./views/AllDeviceList";
import DeviceDetailsLayout from "./views/DeviceDetailsLayout";
import Home from "./views/Home";
import { Assignment, Devices } from "@mui/icons-material";
import VerificationCodeDialog from "./components/VerificationCodeDialog";

function Router({ children }) {
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

    {
      handle: {
        icon: <Assignment />,
        breadCrumsCaption: "Lista de roles",
      },
      path: "all-roles",
      element: <RoleList />,
    },
  ];

  const customRoutes = createBrowserRouter([
    {
      path: "/network-devices",
      element: <Home />,
      children: pages,
    },
  ]);

  return <RouterProvider router={customRoutes} />;
}

export default Router;
