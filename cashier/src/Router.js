import React from "react";
import { PointOfSale, LocalActivity } from "@mui/icons-material";
import Register from "./screen/Register";
import Pay from "./screen/Pay";
import Home from "./screen/Home";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { useLayoutEffect } from "react";
import { ApiContext } from "./context/ApiContext";
import { Box, Typography } from "@mui/material";
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
    return (
      <Box
        sx={{
          width: "30vw",
          height: "50vh",
          marginLeft: "35vw",
          marginTop: "20vh",
          backgroundColor: "grey",
          padding: "20px",
          color: "white",
        }}
      >
        <Typography variant="h4">
          Hemos detectado un error en el código del sistema, por favor reporte
          al servicio técnico. Gracias.
        </Typography>
      </Box>
    );
  }

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
      errorElement: <ErrorBoundary />,
    },
    {
      path: "*",
      element: <ErrorBoundary />,
    },
  ]);
  customRoutes.subscribe(autoDeepLink);
  return <RouterProvider router={customRoutes} />;
};

export default Router;
