import merge from "lodash/merge";
import React, { useMemo } from "react";
import { isDateControl, isDescriptionHidden, rankWith } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { FormHelperText, Hidden } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
	MaterialInputControl,
	ResettableTextField,
	useFocus,
} from "@jsonforms/material-renderers";
import { Box } from "@mui/material";
import { debounce } from "lodash";
import dayjs from "dayjs";

const EnrichmentDatePicker = (metaProps) => {
	const MaterialDateControl = (props) => {
		const [focused, onFocus, onBlur] = useFocus();
		const {
			description,
			id,
			errors,

			uischema,
			visible,
			enabled,
			required,
			path,
			type,
			handleChange,
			data,
			config,
		} = props;

		const createOnChangeHandler =
			(path, handleChange) => (time, textInputValue) => {
				if (!time) {
					handleChange(path, undefined);
					return;
				}
				const result = time.valueOf();
				handleChange(path, result === "Invalid Date" ? textInputValue : result);
			};

		const getData = (data) => {
			if (!data) {
				return null;
			}
			const dayjsData = dayjs(data);

			if (dayjsData.toString() === "Invalid Date") {
				return null;
			}
			return dayjsData;
		};

		const isValid = errors.length === 0;
		const appliedUiSchemaOptions = merge({}, config, uischema.options);
		const showDescription = !isDescriptionHidden(
			visible,
			description,
			focused,
			appliedUiSchemaOptions.showUnfocusedDescription
		);

		const format = appliedUiSchemaOptions.dateFormat ?? "YYYY-MM-DD";

		const views = appliedUiSchemaOptions.views ?? ["year", "day"];

		const firstFormHelperText = showDescription
			? description
			: !isValid
			? errors
			: null;
		const secondFormHelperText = showDescription && !isValid ? errors : null;

		const onChange = useMemo(() => {
			if (type !== "create") {
				return debounce(createOnChangeHandler(path, handleChange), 3000);
			} else {
				return createOnChangeHandler(path, handleChange);
			}
		}, [handleChange, path, type]);

		const value = getData(data);
		const valueInInputFormat = value ? value.format(format) : "";

		const handleKeyPressAmount = (e) => {
			const allowedChars = /[0-9/]/;
			const charCode = e.charCode;
			const char = String.fromCharCode(charCode);
			if (!allowedChars.test(char)) {
				e.preventDefault();
			}
		};

		return (
			<Box sx={{ width: "97%" }}>
				<Hidden xsUp={!visible}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label={uischema.otherLabel}
							value={value}
							onChange={onChange}
							inputFormat={format}
							disableMaskedInput
							views={views}
							disabled={!enabled}
							disableFuture
							InputAdornmentProps={{
								style: {
									marginRight: "16px",
								},
							}}
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
	const MaterialDateProps = (props) => {
		return (
			<MaterialInputControl
				{...props}
				{...metaProps}
				input={MaterialDateControl}
			/>
		);
	};

	const tester = rankWith(5, isDateControl);
	const renderer = withJsonFormsControlProps(MaterialDateProps);

	const Renderer = { tester, renderer };
	return Renderer;
};

export default EnrichmentDatePicker;
