import { ApiContext } from "@oc/api-context";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";

const DescribeText = (props) => {
  const { Get } = useContext(ApiContext);
  const [information, setInformation] = useState("");
  useEffect(() => {
    Get(props.otherPath ? props.otherPath : `/${props.preFixApi}/v1/describe/${props.ID}`)
    .then(({ data }) => {
      setInformation(data[0]);
    });
    // eslint-disable-next-line
  }, [props.ID,props.otherPath]);
  return information;
};
export default DescribeText;