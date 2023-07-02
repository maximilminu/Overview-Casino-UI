import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhonelinkOffIcon from "@mui/icons-material/PhonelinkOff";
import DevicesIcon from "@mui/icons-material/Devices";
import CreateIcon from "@mui/icons-material/Create";
import EditOffIcon from "@mui/icons-material/EditOff";
import NoMeetingRoomIcon from "@mui/icons-material/NoMeetingRoom";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { IconButton, Tooltip, Zoom } from "@mui/material";
import { useEffect, useState } from "react";

export const icons = [
	{
		name: "ReadInformation",
		tooltipUnchecked: "No puede ver información del área ",
		tooltipChecked: "Puede ver información del área",
		iconDisabled: VisibilityOffIcon,
		iconUnchecked: VisibilityOffIcon,
		iconChecked: RemoveRedEyeIcon,
	},
	{
		name: "WriteInformation",
		tooltipUnchecked: "Sin acceso edición de información ",
		tooltipChecked: "Acceso a edición de información",
		iconDisabled: EditOffIcon,
		iconUnchecked: EditOffIcon,
		iconChecked: CreateIcon,
	},
	{
		name: "AccessToDoor",
		tooltipUnchecked: "Sin acceso a el Area",
		tooltipChecked: "Acceso a el Area",
		iconDisabled: NoMeetingRoomIcon,
		iconUnchecked: NoMeetingRoomIcon,
		iconChecked: MeetingRoomIcon,
	},
	{
		name: "AccessToTerminal",
		tooltipUnchecked: "Sin acceso a la Terminal",
		tooltipChecked: "Acceso a la Terminal",
		iconDisabled: PhonelinkOffIcon,
		iconUnchecked: PhonelinkOffIcon,
		iconChecked: DevicesIcon,
	},
];

export const AreaPermissionIcon = (props) => {
	const [val, setVal] = useState(false);
	const [label, setLabel] = useState(false);

	useEffect(() => {
		setVal(props.value);
		setLabel(checkbox[props.value ? "tooltipChecked" : "tooltipUnchecked"]);

		//eslint-disable-next-line
	}, [props.value]);

	const checkbox = icons.filter((i) => i.name === props.name)[0];

	return (
		<Tooltip TransitionComponent={Zoom} title={label} key={props.name}>
			{(props.onClick && (
				<IconButton aria-label={label} onClick={props.onClick}>
					{val ? (
						<checkbox.iconChecked sx={{ color: "fourth.main", ...props.sx }} />
					) : (
						<checkbox.iconUnchecked
							sx={{ color: "primary.dark", ...props.sx }}
						/>
					)}
				</IconButton>
			)) ||
				(val && (
					<checkbox.iconChecked sx={{ color: "fourth.main", ...props.sx }} />
				)) || (
					<checkbox.iconUnchecked sx={{ color: "primary.dark", ...props.sx }} />
				)}
		</Tooltip>
	);
};
