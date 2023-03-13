import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Typography } from "@mui/material";
import { useLocation, useMatches, Link } from "react-router-dom";

const Breadcrumbs = () => {
	const url = useLocation().pathname;
	const matches = useMatches();

	return (
		<MUIBreadcrumbs aria-label="breadcrumb" sx={{ color: "white" }}>
			{matches.map((element) => (
				<>
					{element.pathname === url ? (
						<Typography sx={{ color: "white", fontWeight: "bold" }}>
							{element.handle?.breadCrumsCaption}
						</Typography>
					) : (
						<Link
							to={element.pathname}
							style={{ color: "white", fontWeight: "bold" }}
						>
							{element.handle?.breadCrumsCaption}
						</Link>
					)}
				</>
			))}
		</MUIBreadcrumbs>
	);
};

export default Breadcrumbs;
