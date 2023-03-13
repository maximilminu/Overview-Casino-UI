import { materialRenderers } from "@jsonforms/material-renderers";
// import DateTimePicker from "./DateTimePicker";
//renderizado de json form
const renderers = [
	...materialRenderers,
	//register custom renderers
	// DateTimePicker,
];

export default renderers;
