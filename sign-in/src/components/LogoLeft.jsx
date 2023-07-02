import {
  Box,
  styled,
  Tooltip,
  Zoom,
  tooltipClasses,
} from "@mui/material";
import React from "react";
import { useContext } from "react";
import { ConfigContext } from "../context/ConfigProvider";
import packageJson from "../../package.json";

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
  const config = useContext(ConfigContext);

  const LogoBoxStyle = {
    width: { xl: "200px", lg: "200px", md: "200px", sm: "200px", xs: "150px" },
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
          <Box
            component="img"
            alt="logo tecnoazar"
            sx={LogoBoxStyle}
            src={config.LogoLeft}
          />
        </HtmlTooltip>
      ) : (
        <Tooltip
          placement="bottom"
          TransitionComponent={Zoom}
          title={`v${packageJson.version}`}
        >
          <Box
            component="img"
            alt="logo tecnoazar"
            sx={LogoBoxStyle}
            src={config.LogoLeft}
          />
        </Tooltip>
      )}
    </>
  );
};

export default LogoLeft;
