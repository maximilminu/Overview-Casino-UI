import {
  Box,
  styled,
  Tooltip,
  useMediaQuery,
  useTheme,
  Zoom,
  tooltipClasses,
} from "@mui/material";
import React from "react";
import { useContext } from "react";
import { ConfigContext } from "../context/ConfigProvider";
import packageJson from "../../package.json";
import { Link } from "react-router-dom";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "red",
    fontWeight: 700,
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: "20px",
    border: "1px solid #dadde9",
  },
}));

const LogoLeft = () => {
  const theme = useTheme();
  const config = useContext(ConfigContext);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const LogoBoxStyle = {
    display: !matches && "flex",
    position: matches && "absolute",
    marginInline: !matches && "auto",
    top: matches && 0,
    left: matches && "50px",
    width: "200px",
    height: "115px",
    objectFit: "contain",
  };

  return (
    <>
      {packageJson.version.includes("rc") ? (
        <HtmlTooltip
          placement="bottom"
          TransitionComponent={Zoom}
          title={`v${packageJson.version}`}
        >
          <Link to="/front-desk">
            <Box
              component="img"
              alt="logo tecnoazar"
              sx={LogoBoxStyle}
              src={config.LogoLeft}
            />
          </Link>
        </HtmlTooltip>
      ) : (
        <Tooltip
          placement="bottom"
          TransitionComponent={Zoom}
          title={`v${packageJson.version}`}
        >
          <Link to="/front-desk">
            <Box
              component="img"
              alt="logo tecnoazar"
              sx={LogoBoxStyle}
              src={config.LogoLeft}
            />
          </Link>
        </Tooltip>
      )}
    </>
  );
};

export default LogoLeft;
