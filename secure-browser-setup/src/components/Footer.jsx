import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Link } from "react-router-dom";
import { Box, IconButton, Tooltip, Typography, Zoom } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Footer() {
  return (
    <>
      {/* Footer where info will be placed inside */}
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          background:
            "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))",
          top: "auto",
          bottom: 0,
        }}
      >
        {/* Corresponding wrapper for content */}
        <Toolbar style={{ display: "flex", justifyContent: "flex-end" }}>
          <Tooltip TransitionComponent={Zoom} arrow title="Check In">
            <Link to="/front-desk/check-in">
              <IconButton>
                <CheckCircleIcon
                  sx={{ marginRight: "15px", color: "third.main" }}
                />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip TransitionComponent={Zoom} arrow title="Lista de Miembros">
            <Link to="/front-desk/member-list">
              <IconButton>
                <PeopleAltIcon
                  sx={{ marginRight: "15px", color: "third.main" }}
                />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip TransitionComponent={Zoom} arrow title="Agregar Miembro">
            <Link to="/front-desk-add-user/*">
              <IconButton sx={{ marginLeft: "auto" }}>
                <PersonAddAlt1Icon
                  sx={{ marginRight: "15px", color: "third.main" }}
                />
              </IconButton>
            </Link>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </>
  );
}
