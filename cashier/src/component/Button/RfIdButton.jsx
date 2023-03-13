import React, { useContext } from "react";
import {
  RfIdReaderContext,
  READER_STATUS_OFFLINE,
} from "../../context/RfIdReaderContext";
import { IconButton, Typography } from "@mui/material";
import { Sensors } from "@mui/icons-material";

const RfIdReaderButton = ({}) => {
  const { RfIdReader } = useContext(RfIdReaderContext);

  return (
    <IconButton
      onClick={() => {
        if (RfIdReader.status === READER_STATUS_OFFLINE) {
          RfIdReader.connect();
        }
      }}
      sx={{ flexDirection: "column" }}
    >
      <Sensors
        sx={{
          fill: RfIdReader.status === READER_STATUS_OFFLINE ? "red" : "green",
        }}
      />
      <Typography sx={{ color: "white" }} fontSize="xx-small">
        {RfIdReader.name()}
      </Typography>
    </IconButton>
  );
};

export default RfIdReaderButton;
