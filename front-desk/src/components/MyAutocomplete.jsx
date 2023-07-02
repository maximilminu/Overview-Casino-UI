import { Autocomplete, Box, TextField, Typography, useTheme } from "@mui/material";
import { ApiContext } from "@oc/api-context";
import React, { useEffect, useState } from "react";
import { useContext } from "react";

const MyAutocomplete = (props) => {
  const [loadingApi, setLoadingApi] = useState(false);
  const [inputAutocomplete, setInputAutocomplete] = useState(false);
  const [apiResults, setApiResults] = useState([]);
  const {Get} = useContext(ApiContext)
  const theme = useTheme()
    const {options,data} = props


  const capitalizer = (word) => {
    const result = word.map((singleWord) => {
      return (
        singleWord.charAt(0).toUpperCase() + singleWord.slice(1).toLowerCase()
      );
    });
    // console.log(result)
     return result.join(" > ");
  };

  return (
    <Autocomplete
    id="input-autocomplete"
    size="small"
    options={options}
    getOptionLabel={(options) => options.Name }
    isOptionEqualToValue={(option, value) => option.ID === value.ID}
    includeInputInList
     sx={{ width: "99%" }}
    // value={info}
    onChange={props.onChange}
    noOptionsText="Sin resultados"
    inputValue={data}
    onInputChange={props.onInputChange}
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
        variant="standard"
      />
    )}
  />
  );
};

export default MyAutocomplete;