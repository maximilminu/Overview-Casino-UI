import React, { useState, useContext, useLayoutEffect } from "react";
import { Avatar, CircularProgress, Typography } from "@mui/material";
import { ApiContext } from "@oc/api-context";

const AvatarComponent = (props) => {
  const [picture, setPicture] = useState(false);
  const [loading, setLoading] = useState(false);
  const { Get } = useContext(ApiContext);

  useLayoutEffect(() => {
    if (
      (props.src === undefined || props.src === false) &&
      props.subject &&
      props.subject.ID
    ) {
      setLoading(true);
      Get(
        `/storage/avatar/${props.subject.ID}/${
          props.size || 1000
        }?t=${Date.now()}`
      )
        .then(({ data }) => {
          setLoading(false);
          setPicture(data);
        })
        .catch((err) => {
          setLoading(false);
          setPicture(false);
        });
    }
    // eslint-disable-next-line
  }, [props.src, props.subject]);

  return (
    <Avatar {...props} src={props.src || picture || ""}>
      {loading && (
        <CircularProgress sx={{ position: "absolute" }} color="grey" />
      )}
      {props.counter > 1 && <Typography>{props.counter}</Typography>}

      {(picture === false || loading) && props.subject && props.subject.FullName
        ? props.subject?.FullName.split(" ")[0].slice(0, 1)
        : ""}

      {props.children && props.children}
    </Avatar>
  );
};

export default AvatarComponent;
