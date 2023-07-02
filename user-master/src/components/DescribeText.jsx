import { useState, useLayoutEffect } from "react";
import { Tooltip, Typography, Zoom } from "@mui/material";
import useDescribe from "../hook/useDescribe";

const DescribeText = (props) => {
	const describePromise = useDescribe(props);
	const [text, setText] = useState([]);
	const [tooltip, setTooltip] = useState([]);
	const [withTooltip, setWithTooltip] = useState(props.withParentsTooltip);

	let TransitionComponent;

	if (!props.TransitionComponent) {
		TransitionComponent = Zoom;
	} else {
		TransitionComponent = props.TransitionComponent;
	}

	useLayoutEffect(() => {
		describePromise.then((desc) => {
			if (props.displayFullPath) {
				setText(desc.join(props.fullPathJoin || ", "));
			} else {
				setText(desc[0]);
				if (desc.length > 1) {
					setTooltip(desc.slice(1).join(props.fullPathJoin || ", "));
				} else {
					setWithTooltip(false);
				}
			}
		});
		//eslint-disable-next-line
	}, [props.dependency]);

	if (withTooltip) {
		return (
			<Tooltip TransitionComponent={TransitionComponent} title={tooltip}>
				<Typography sx={props.sx}>{text}</Typography>
			</Tooltip>
		);
	}

	return <Typography sx={props.sx}>{text}</Typography>;
};
export default DescribeText;
