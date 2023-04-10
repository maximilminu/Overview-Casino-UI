import React, { useEffect, useState } from "react";
import { Paper, Container, Button, Icon, Grid } from "@mui/material";
import Tree from "./Tree";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Outlet, useOutlet } from "react-router";
// Estilos
const style = {
  paper: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "3rem",
    gap: "1rem",
    backgroundColor: "third.main",
    marginBottom: "20px",
    marginTop: "20px",
    height: "100%",
    borderRadius: "1rem",
  },
  paperRight: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "3rem",
    gap: "1rem",
    backgroundColor: "third.main",
    marginBottom: "20px",
    marginTop: "20px",
    width: "100%",
    borderRadius: "1rem",
  },
};

const nodeIdCollector = (item) => {
  let childIds = (item.childs || item).map(nodeIdCollector);
  childIds.push(item.id);

  return childIds;
};

const areas = [
  {
    id: 0,
    label: "Casino Mar del Plata",
    childs: [
      {
        id: 1,
        label: "Planta Baja",
        childs: [
          {
            id: 2,
            label: "Recepcion",
            childs: [
              {
                id: 3,
                label: "Terminal",
                childs: [],
              },
            ],
          },
          {
            id: 4,
            label: "Cafeteria",
            childs: [
              {
                id: 5,
                label: "Terminal",
                childs: [],
              },
            ],
          },
        ],
      },
      {
        id: 6,
        label: "Primer Piso",
        childs: [
          {
            id: 7,
            label: "Restaurante",
            childs: [],
          },
        ],
      },
      {
        id: 8,
        label: "Segundo Piso",
        childs: [
          {
            id: 9,
            label: "Sector Fumadores",
            childs: [],
          },
        ],
      },
      {
        id: 10,
        label: "Tercer Piso",
        childs: [
          {
            id: 11,
            label: "Terraza",
            childs: [
              {
                id: 12,
                label: "Sector Fumadores",
                childs: [],
              },
            ],
          },
        ],
      },
      {
        id: 13,
        label: "Terraza",
        childs: [
          {
            id: 14,
            label: "Sector Fumadores",
            childs: [],
          },
        ],
      },
    ],
  },
];

function Father() {
  const ifOutlet = useOutlet();

  const ItemActions = ({ item, depth, idx, data }) => {
    return <>{/* <ModeEditIcon sx={{ color: "grey" }} /> */}</>;
  };

  return ifOutlet ? (
    <Outlet />
  ) : (
    <Grid
      container
      md={8}
      component={Paper}
      sx={{ height: "90%", overflow: "auto", marginX: "auto", marginY: "15px" }}
    >
      <Tree data={areas} onOpenCloseAll={null} rightActions={ItemActions} />
    </Grid>
  );
}

export default Father;
