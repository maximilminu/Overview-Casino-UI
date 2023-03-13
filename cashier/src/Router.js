import React from "react";
import { PointOfSale, LocalActivity } from "@mui/icons-material";
import Register from "./screen/Register";
import Pay from "./screen/Pay";
import Home from "./screen/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const Router = () => {
  const pages = [
    {
      handle: { icon: <PointOfSale />, breadCrumsCaption: "Arqueo de caja" },
      path: "register",
      element: <Register />,
    },
    {
      handle: { icon: <LocalActivity />, breadCrumsCaption: "Pago de tickets" },
      path: "pay",
      element: <Pay />,
    },
  ];
  const customRoutes = createBrowserRouter([
    {
      path: "/cashier",
      element: <Home />,
      children: pages,
    },
  ]);

  return <RouterProvider router={customRoutes} />;
};

export default Router;
