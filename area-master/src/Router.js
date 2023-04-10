import React from "react";
import { AccountTree, LocalActivity } from "@mui/icons-material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./views/Home";
import Father from "./component/Tree/Father";
import SingleAreaView from "./views/SingleAreaView";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
const Router = () => {
  const pages = [
    // {
    //   handle: { icon: <PointOfSale />, breadCrumsCaption: "Arqueo de caja" },
    //   path: "register",
    //   element: <Register />,
    // },
    {
      handle: { icon: <AccountTree />, breadCrumsCaption: "Areas" },
      path: "all-areas",
      element: <Father />,
      children: [
        {
          handle: {
            icon: <LocalActivity />,
            breadCrumsCaption: "Detalle",
          },
          path: "single-area/:id",
          element: <SingleAreaView />,
        },
      ],
    },
  ];
  const customRoutes = createBrowserRouter([
    {
      path: "/area-master",
      element: <Home />,
      children: pages,
    },
  ]);

  return <RouterProvider router={customRoutes} />;
};

export default Router;
