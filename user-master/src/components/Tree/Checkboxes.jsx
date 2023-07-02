import React from "react";
import { Tooltip, Zoom } from "@mui/material";
import IconButton from "@mui/material/IconButton";

function Checkboxes({ item, checkboxes, values, onClick }) {
	// console.log("checkbox.iconUnchecked}: ", checkboxes.iconUnchecked);

	return (
		<>
			{checkboxes.map((checkbox, index) => {
				const label = values[checkbox.name]
					? checkbox.tooltipChecked
					: checkbox.tooltipUnchecked;

				return (
					<Tooltip key={index} TransitionComponent={Zoom} title={label}>
						<IconButton
							aria-label={label}
							id={item.ID}
							onClick={() => onClick(item.ID, checkbox.name)}
						></IconButton>
					</Tooltip>
				);
			})}
		</>
	);
}

export default Checkboxes;
