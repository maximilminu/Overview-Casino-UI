import React from "react";

import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Clear } from "@mui/icons-material";
import Typing from "./Spinner/typing2/Typing";

const CustomTextField = ({
	variant = "outlined",
	label,
	placeholder,
	startIcon = null,
	handleFocus,
	InputType,
	value,
	handleInputChange,
	typing,
	setTyping,
	id,
	onBlurToTyping=false,
	handleClearClick,
	unableClear
}) => {
	
	return (
			<TextField
				id={id}
				value={value}
				variant={variant}
				label={label}
				autoComplete="off"
				onBlur={(onBlurToTyping?()=>setTyping(false):null)}
				placeholder={placeholder}
				InputProps={{
					startAdornment: startIcon ? (
						<InputAdornment position="start">{startIcon}</InputAdornment>
					) : null,
					endAdornment: (
						<InputAdornment sx={{width:"50px"}} position="end">
							{typing ? (
								<Typing />
							) : (
								unableClear? null :(
								<IconButton onClick={handleClearClick}>
									<Clear />
								</IconButton>)
							)}
						</InputAdornment>
					),
					onFocus: handleFocus,
					onChange:(e)=>{
						setTyping(true)
						handleInputChange(e)
					},
				}}
			/>
	);
};
export default CustomTextField;
