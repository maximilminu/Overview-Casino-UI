import React, { useState, useContext, useLayoutEffect } from "react";
import { Avatar, CircularProgress } from "@mui/material";
import { ApiContext } from "@oc/api-context";
import Person2Icon from "@mui/icons-material/Person2";

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
      Get(`/storage/avatar/${props.subject.ID}/1000?t=${Date.now()}`)
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

      {(picture === false || loading) &&
        props.subject?.Name &&
        (props.subject?.Name ? (
          props.subject?.Name.slice(0, 1).toUpperCase()
        ) : (
          <Person2Icon sx={{ color: "white" }} />
        )) +
          (props.subject?.Lastname ? (
            props.subject?.Lastname.slice(0, 1).toUpperCase()
          ) : (
            <Person2Icon sx={{ color: "white" }} />
          ))}

      {(picture === false || loading) &&
        props.subject?.FullName &&
        (props.subject?.FullName ? (
          props.subject?.FullName.split(" ")[0].slice(0, 1)
        ) : (
          <Person2Icon sx={{ color: "white" }} />
        ))}

      {props.children && props.children}
    </Avatar>
  );
};

export default AvatarComponent;
