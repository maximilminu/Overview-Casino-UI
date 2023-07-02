import React, { useEffect, useState } from "react";
import { isStringControl, rankWith } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { MaterialInputControl } from "@jsonforms/material-renderers";
import merge from "lodash/merge";
import { useDebouncedChange } from "@jsonforms/material-renderers";
import CustomTextField from "../CustomInput";
import { useParams } from "react-router-dom";

const EnrichmentInput = (metaProps) => {
	const MuiInputText = (props) => {
		const eventToValue = (ev) =>
			ev.target.value === "" ? undefined : ev.target.value;
		const [typing, setTyping] = useState(false);
		const {
			data,
			config,
			enabled,
			// id,
			uischema,
			path,

			handleChange,
			schema,
			muiInputProps,
			type,
			debounced = 0,
		} = props;
		const maxLength = schema.maxLength;
		const appliedUiSchemaOptions = merge({}, config, uischema.options);
		let inputProps;
		const { id } = useParams();
		if (appliedUiSchemaOptions.restrict) {
			inputProps = { maxLength: maxLength };
		} else {
			inputProps = {};
		}

		useEffect(() => {}, []);

		inputProps = merge(inputProps, muiInputProps);

		if (appliedUiSchemaOptions.trim && maxLength !== undefined) {
			inputProps.size = maxLength;
		}

		const [inputText, onChange, onClear] = useDebouncedChange(
			handleChange,
			"",
			data,
			path,
			eventToValue,
			debounced
		);

		useEffect(() => {
			let timeoutId;

			if (typing) {
				timeoutId = setTimeout(
					() => {
						setTyping(false);
					},
					type === "create" ? 2000 : 4000
				);
			}

			return () => {
				clearTimeout(timeoutId);
			};
			//eslint-disable-next-line
		}, [typing]);

		const handleKeyPressAlphanumeric = (e) => {
			const charCode = e.charCode;
			const char = String.fromCharCode(charCode);

			if (uischema.alphanumeric) {
				return;
			}

			if (uischema.dni && !/^[a-zA-Z0-9ñÑ\s]+$/.test(char)) {
				e.preventDefault();
			}

			if (
				!uischema.dni &&
				!uischema.alphanumeric &&
				!/^[a-zA-ZñÑ\s]+$/.test(char)
			) {
				e.preventDefault();
			}
		};

		return (
			<CustomTextField
				variant="standard"
				sx={styles.input}
				typing={typing}
				setTyping={setTyping}
				handleInputChange={onChange}
				value={inputText}
				id={id}
				disabled={!enabled}
				label={uischema.otherLabel}
				alphanumeric={uischema.alphanumeric}
				onBlurToTyping={type === "create"}
				handleClearClick={onClear}
				unableClear={debounced !== 0 || (id && true)}
				onKeyPress={handleKeyPressAlphanumeric}
			/>
		);
	};

	const MaterialTextControl = (props) => {
		return (
			<MaterialInputControl {...props} {...metaProps} input={MuiInputText} />
		);
	};

	const tester = rankWith(2, isStringControl);
	const renderer = withJsonFormsControlProps(MaterialTextControl);

	const Renderer = { tester, renderer };

	return Renderer;
};

export default EnrichmentInput;
const styles = {
	input: {
		"&:disabled": {
			"& .MuiInputLabel-root": {
				color: "red",
			},
			"& .MuiOutlinedInput-root": {
				"& fieldset": {
					borderColor: "red",
				},
				"& input": {
					color: "red",
				},
			},
		},
	},
};
