import React, { useContext, useEffect, useRef } from "react";
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
import { ConfigContext } from "@oc/config-context";
import Breadcrumbs from "./Breadcrumbs";

export default function Footer(props) {
  const config = useContext(ConfigContext);
  const theme = useTheme();
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const routeContext = useContext(UNSAFE_RouteContext);
  const routes = routeContext.matches[0].route;

  const ref = useRef(false);

  useEffect(() => {
    if (props.onHeightChange) {
      props.onHeightChange(ref.current.offsetHeight);
    }
    // eslint-disable-next-line
  }, [ref]);

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
        ref={ref}
        component="Footer"
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
                  // height: "10px",
                  maxHeight: ref.current.offsetHeight * 0.7,
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
