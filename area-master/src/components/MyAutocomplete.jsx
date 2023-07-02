import { Autocomplete, Box, TextField } from "@mui/material";
import React, { useState } from "react";

const MyAutocomplete = (props) => {
  // eslint-disable-next-line
  const [loadingApi, setLoadingApi] = useState(false);

  const capitalizer = (word) => {
    const result = word.map((singleWord) => {
      return (singleWord.charAt(0).toUpperCase() + singleWord.slice(1).toLowerCase());
    });
     return result.join(" > ");
  };

  return (
    <Autocomplete
    id="input-autocomplete"
    size="small"
    options={props.options}
    getOptionLabel={(options) => options.Name || "" }
    isOptionEqualToValue={(option, value) => value && (option.ID === value.ID)}
    disabled={props.disabled || (props.value && props.value.length === 0 && true)}
    includeInputInList
    label={props.label}
    sx={ props.sx || { width: "98%",  marginBottom:"5px" }}
    onChange={props.onChange}
    noOptionsText="Sin resultados"
    value={props.value}
    onInputChange={(e, newValue) => {
      props.onInputChange(e, newValue);
    }}
    loading={loadingApi}
    loadingText="Buscando..."
    renderOption={(props, option, { selected }) => (
      <li {...props}>
        <Box/>
        <Box component="span" />
        <Box sx={{textDecoration:"uppercase"}}>
          {option.Name}
          <br />
           <span style={{fontSize:"15px", color:"grey"}}>{capitalizer(option.Parents)}</span> 
        </Box>
        <Box/>
      </li>
    
  )}
    renderInput={(params) => (
      <TextField
        size="small"
        {...params}
        label={props.label}
        variant="standard"
      />
    )}
  />
  );
};

export default MyAutocomplete;
