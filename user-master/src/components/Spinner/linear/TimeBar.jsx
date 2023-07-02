import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export function TimeBar() {
	const [progress, setProgress] = React.useState(10);

	React.useEffect(() => {
		setInterval(() => {
			setProgress((prevProgress) =>
				prevProgress >= 100 ? 10 : prevProgress + 10
			);
		}, 1000);
	}, []);

	return (
		<Box sx={{ width: "100%", marginTop: "0.4rem" }}>
			<LinearProgress variant="determinate" value={progress} />
		</Box>
	);
}
