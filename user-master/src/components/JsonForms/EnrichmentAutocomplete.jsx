import React from "react";
import { isEnumControl, rankWith } from "@jsonforms/core";
import { withJsonFormsEnumProps, withTranslateProps } from "@jsonforms/react";
import CustomAutocomplete from "../CustomAutocomplete";

const EnrichmentAutocomplete = (metaProps) => {
	const MuiAutocomplete = (props) => {
		const { data, uischema, path, handleChange } = props;

		const handleRoleChange = (event, selectedOptions) => {
			const selectedRoleIds = selectedOptions.map((option) => option.const);
			handleChange(path, selectedRoleIds);
		};
		const isOptionEqualToValue = (option, value) => {
			return option.const === value.const;
		};

		const controlledData = data || [];

		return (
			<CustomAutocomplete
				sx={{
					"& .MuiAutocomplete-tag": {
						backgroundColor: "primary.dark",
						color: "third.main",
						fontWeight: "500",
					},
				}}
				value={
					controlledData &&
					controlledData.map((roleId) => {
						const role = metaProps.options.find(
							(option) => option.const === roleId
						);
						return { const: roleId, title: role ? role.title : "" };
					})
				}
				onInputChange={(a) => {}}
				label={uischema.label}
				onChange={handleRoleChange}
				options={metaProps.options}
				isOptionEqualToValue={isOptionEqualToValue}
			/>
		);
	};

	const tester = rankWith(10, isEnumControl);
	const renderer = withJsonFormsEnumProps(withTranslateProps(MuiAutocomplete));
	const Renderer = { tester, renderer };
	return Renderer;
};

export default EnrichmentAutocomplete;
