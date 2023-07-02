import React from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Clear } from "@mui/icons-material";
import Typing from "./Spinner/typing2/Typing";
const CustomTextField = (props) => {
  const {
    variant = "outlined",
    label,
    placeholder,
    startIcon = null,
    handleFocus,

    value,
    handleInputChange,
    typing,
    setTyping,
    id,
    onBlurToTyping = false,
    handleClearClick,
    unableClear,
  } = props;
  return (
    <TextField
      id={id}
      value={value}
      variant={variant}
      label={label}
      disabled={props.disabled}
      alphanumeric={props.alphanumeric}
      size={props.size}
      autoComplete="off"
      sx={props.sx || { marginRight: 1 }}
      onBlur={onBlurToTyping ? () => setTyping(false) : null}
      placeholder={placeholder}
      onKeyPress={props.onKeyPress}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : null,
        endAdornment: (
          <InputAdornment
            sx={{
              width: props.withoutEndAdorment && "0px",
              marginRight: typing && "35px",
            }}
            position="end"
          >
            {typing ? (
              <Typing />
            ) : props.withoutEndAdorment ? null : (
              unableClear && (
                <IconButton size="small" onClick={handleClearClick}>
                  <Clear fontSize="small" />
                </IconButton>
              )
            )}
          </InputAdornment>
        ),
        onFocus: handleFocus,
        onChange: (e) => {
          setTyping && setTyping(true);
          handleInputChange ? handleInputChange(e) : props.onChange(e);
        },
      }}
    />
  );
};
export default CustomTextField;
