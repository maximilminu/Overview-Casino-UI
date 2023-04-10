import React, { useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Zoom,
  styled,
  tooltipClasses,
} from "@mui/material";
import DeskIcon from "@mui/icons-material/Desk";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import InsertPageBreakIcon from "@mui/icons-material/InsertPageBreak";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import RouterIcon from "@mui/icons-material/Router";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";

const array = [
  {
    UI: "Front-desk",
    URL: "https://test.overview.casino/front-desk",
    ICON: <DeskIcon />,
  },
  {
    UI: "EGM Operation Manager",
    URL: "https://test.overview.casino/egm-operation-manager",
    ICON: <NoteAddIcon />,
  },
  {
    UI: "New Ticket Generator",
    Description: " TOtalmente nuevo",
    URL: "https://test.overview.casino/ticket/new-insert/",
    ICON: <FiberNewIcon />,
  },
  {
    UI: "Pre Insert",
    Description: "Se creo, esta en la base de datos pero no se imprimio",
    URL: "https://test.overview.casino/ticket/pre-insert/",
    ICON: <InsertPageBreakIcon />,
  },
  {
    UI: "EGM Operation Auditor",
    URL: "https://test.overview.casino/egm-operation-auditor",
    ICON: <AssignmentIcon />,
  },
  {
    UI: "Cashier",
    URL: "https://test.overview.casino/cashier",
    ICON: <PointOfSaleIcon />,
  },
  {
    UI: "Network Devices",
    URL: "https://test.overview.casino/network-devices",
    ICON: <RouterIcon />,
  },
  {
    UI: "User Master",
    URL: "https://test.overview.casino/user-master/add-user/",
    ICON: <ContactEmergencyIcon />,
  },
];

export default function Footer(props) {
  const ref = useRef(false);
  useEffect(() => {
    if (props.onHeightChange) {
      props.onHeightChange(ref.current.offsetHeight);
    }
    // eslint-disable-next-line
  }, [ref]);

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: 15,
    },
  }));

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
        component="footer"
      >
        {/* Corresponding wrapper for content */}
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-around",
            fontSize: "20px",
          }}
        >
          {array.map((ui) => (
            <BootstrapTooltip
              key={ui.UI}
              TransitionComponent={Zoom}
              arrow
              title={ui.UI}
            >
              <a target="blank" href={ui.URL}>
                <IconButton sx={{ color: "white", width: "15%" }}>
                  {ui.ICON}
                </IconButton>
              </a>
            </BootstrapTooltip>
          ))}
        </Toolbar>
      </AppBar>
    </>
  );
}
