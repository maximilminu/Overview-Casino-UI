import React, { useState } from "react";

import { Input, InputAdornment } from "@mui/material";
import merge from "lodash/merge";

import { useDebouncedChange } from "@jsonforms/material-renderers";
import Typing from "../Spinner/typing2/Typing";

export const MuiInputText = React.memo((props) => {
	const [typing, setTyping] = useState(false);
	const [, setShowAdornment] = useState(false);
	const {
		data,
		config,
		className,
		id,
		enabled,
		uischema,
		isValid,
		path,
		handleChange,
		schema,
		muiInputProps,
		inputComponent,
		// eslint-disable-next-line
		validation,
	} = props;

	const maxLength = schema.maxLength;
	const appliedUiSchemaOptions = merge({}, config, uischema.options);
	let inputProps;
	if (appliedUiSchemaOptions.restrict) {
		inputProps = { maxLength: maxLength };
	} else {
		inputProps = {};
	}
	const customHandleChange = (input, value) => {
		handleChange(input, value, true);
		setTyping(true);
	};
	inputProps = merge(inputProps, muiInputProps);

	if (appliedUiSchemaOptions.trim && maxLength !== undefined) {
		inputProps.size = maxLength;
	}
	const eventToValue = (ev) =>
		ev.target.value === "" ? undefined : ev.target.value;
	const [inputText, onChange] = useDebouncedChange(
		customHandleChange,
		"",
		data,
		path,
		eventToValue,
		2
	);

	const onPointerEnter = () => setShowAdornment(true);
	const onPointerLeave = () => setShowAdornment(false);

	return (
		<Input
			type={appliedUiSchemaOptions.format === "password" ? "password" : "text"}
			value={inputText}
			onChange={onChange}
			className={className}
			id={id}
			onBlur={() => setTyping(false)}
			disabled={!enabled}
			autoFocus={appliedUiSchemaOptions.focus}
			multiline={appliedUiSchemaOptions.multi}
			fullWidth={!appliedUiSchemaOptions.trim || maxLength === undefined}
			inputProps={inputProps}
			error={!isValid}
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			endAdornment={
				<InputAdornment position="end">{typing && <Typing />}</InputAdornment>
			}
			inputComponent={inputComponent}
		/>
	);
});
