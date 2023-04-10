import React, { useContext } from "react";
import {
  RfIdReaderContext,
  READER_STATUS_OFFLINE,
} from "@oc/rfld-reader-context";
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
      <Typography sx={{ color: "black" }} fontSize="xx-small">
        {RfIdReader.name()}
      </Typography>
    </IconButton>
  );
};

export default RfIdReaderButton;
