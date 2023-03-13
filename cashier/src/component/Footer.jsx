import React, { useContext } from "react";
import { Link, UNSAFE_RouteContext } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Zoom,
} from "@mui/material";
import { ConfigContext } from "../context/ConfigProvider";
import Breadcrumbs from "./Breadcrumbs";

export default function Footer() {
  const config = useContext(ConfigContext);
  const theme = useTheme();
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const routeContext = useContext(UNSAFE_RouteContext);
  const routes = routeContext.matches[0].route;

  return (
    <>
      {/* Footer where info will be placed inside */}
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          backgroundColor: "#0e0e0e",
          top: "auto",
          bottom: 0,
        }}
      >
        {/* Corresponding wrapper for content */}
        <Toolbar style={{ display: "flex", justifyContent: "flex-end" }}>
          <Box
            sx={{
              marginRight: "auto",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Link to={routes.path}>
              <Box
                component="img"
                src={config.Images.LogoFooter}
                sx={{
                  objectFit: "contain",
                  width: down600px ? "90px" : "120px",
                  height: "60px",
                }}
              />
            </Link>
            <Breadcrumbs />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", gap: "15px" }}>
            {routes.children.map((route) => {
              let url = route.path;
              route.handle.defaultParams &&
                Object.keys(route.handle.defaultParams).forEach((e) => {
                  url = url.replace(":" + e, route.handle.defaultParams[e]);
                });
              return (
                <Tooltip
                  key={route.path}
                  TransitionComponent={Zoom}
                  arrow
                  title={route.handle.breadCrumsCaption}
                >
                  <Link to={url}>
                    <IconButton sx={{ color: "white" }}>
                      {route.handle.icon}
                    </IconButton>
                  </Link>
                </Tooltip>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
