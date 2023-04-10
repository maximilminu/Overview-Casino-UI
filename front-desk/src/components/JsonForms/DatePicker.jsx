import merge from "lodash/merge";
import React, { useMemo } from "react";
import { isDateControl, isDescriptionHidden, rankWith } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { FormHelperText, Hidden } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
	createOnChangeHandler,
	getData,
	ResettableTextField,
	useFocus,
} from "@jsonforms/material-renderers";
import { Box } from "@mui/material";

export const MaterialDateControl = (props) => {
	const [focused, onFocus, onBlur] = useFocus();
	const {
		description,
		id,
		errors,
		label,
		uischema,
		visible,
		enabled,
		required,
		path,
		handleChange,
		data,
		config,
	} = props;
	const isValid = errors.length === 0;
	const appliedUiSchemaOptions = merge({}, config, uischema.options);
	const showDescription = !isDescriptionHidden(
		visible,
		description,
		focused,
		appliedUiSchemaOptions.showUnfocusedDescription
	);

	const format = appliedUiSchemaOptions.dateFormat ?? "YYYY-MM-DD";
	const saveFormat = appliedUiSchemaOptions.dateSaveFormat ?? "YYYY-MM-DD";

	const views = appliedUiSchemaOptions.views ?? ["year", "day"];

	const firstFormHelperText = showDescription
		? description
		: !isValid
		? errors
		: null;
	const secondFormHelperText = showDescription && !isValid ? errors : null;
	const onChange = useMemo(
		() => createOnChangeHandler(path, handleChange, saveFormat),
		[path, handleChange, saveFormat]
	);

	const value = getData(data, saveFormat);
	const valueInInputFormat = value ? value.format(format) : "";

	const handleKeyPressAmount = (e) => {
		const allowedChars = /[0-9.,/]/;
		const charCode = e.charCode;
		const char = String.fromCharCode(charCode);
		if (!allowedChars.test(char)) {
			e.preventDefault();
		}
	};

	return (
		<Box sx={{ width: "97%", margin: "2%" }}>
			<Hidden xsUp={!visible}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker
						label={label}
						value={value}
						onChange={onChange}
						inputFormat={format}
						disableMaskedInput
						views={views}
						disabled={!enabled}
						disableFuture
						componentsProps={{
							actionBar: {
								actions: (variant) =>
									variant === "desktop" ? [] : ["clear", "cancel", "accept"],
							},
						}}
						renderInput={(params) => (
							<ResettableTextField
								{...params}
								rawValue={data}
								dayjsValueIsValid={value !== null}
								valueInInputFormat={valueInInputFormat}
								onKeyPress={handleKeyPressAmount}
								focused={focused}
								id={id + "-input"}
								required={
									required && !appliedUiSchemaOptions.hideRequiredAsterisk
								}
								autoFocus={appliedUiSchemaOptions.focus}
								error={!isValid}
								fullWidth={!appliedUiSchemaOptions.trim}
								inputProps={{
									...params.inputProps,
									pattern: "[0-9]*",
									inputMode: "numeric",
									type: "text",
								}}
								InputLabelProps={data ? { shrink: true } : undefined}
								onFocus={onFocus}
								onBlur={onBlur}
								variant={"standard"}
							/>
						)}
					/>
					<FormHelperText error={!isValid && !showDescription}>
						{firstFormHelperText}
					</FormHelperText>
					<FormHelperText error={!isValid}>
						{secondFormHelperText}
					</FormHelperText>
				</LocalizationProvider>
			</Hidden>
		</Box>
	);
};

const tester = rankWith(5, isDateControl);
const renderer = withJsonFormsControlProps(MaterialDateControl);

const Renderer = { tester, renderer };
export default Renderer;
