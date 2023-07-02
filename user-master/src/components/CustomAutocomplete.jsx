import { Autocomplete, Checkbox, TextField } from "@mui/material";
import React from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const CustomAutocomplete = (props) => {
	const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
	const checkedIcon = <CheckBoxIcon fontSize="small" />;
	return (
		<Autocomplete
			sx={props.sx}
			value={props.value}
			multiple
			disableCloseOnSelect
			limitTags={props.limitTags}
			id="size-small-standard-multi"
			size="small"
			renderOption={(props, option, { selected }) => (
				<li {...props}>
					<Checkbox
						icon={icon}
						checkedIcon={checkedIcon}
						style={{ marginRight: 8 }}
						checked={selected}
					/>
					{option.title}
				</li>
			)}
			disableClearable
			options={props.options}
			getOptionLabel={(props) => props.title}
			onChange={props.onChange}
			isOptionEqualToValue={props.isOptionEqualToValue}
			renderInput={(params) => (
				<TextField
					{...params}
					variant="standard"
					label={props.label}
					placeholder={props.placeholder}
				/>
			)}
		/>
	);
};

export default CustomAutocomplete;
