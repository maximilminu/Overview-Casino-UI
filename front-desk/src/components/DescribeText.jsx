import { Typography } from "@mui/material";
import { ApiContext } from "@oc/api-context";
import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";

const DescribeText = (props) => {
  const { Get } = useContext(ApiContext);
  const [information, setInformation] = useState();
  useEffect(() => {
    Get(`/${props.preFixApi}/v1/describe/${props.ID}`).then(({ data }) => {
      const info = data.join(", ");
      setInformation(info);
    });
    // eslint-disable-next-line
  }, [props.ID]);

  return <Typography sx={props.style}>{information}</Typography>;
};

export default DescribeText;
