import { IconButton, TextField, InputAdornment } from "@mui/material";
import React, { useContext } from "react";
import { MdSearch } from "react-icons/md";
import { DevicesContext } from "../context/AuthContext";

const Search = ({ allDevices }) => {
  const { setDevices, devices } = useContext(DevicesContext);

  const handleSearchChange = (e) => {
    if (!e.target.value) return setDevices(allDevices);

    // const value = e.target.value.toLowerCase();
    return devices.filter((x) =>
      Object.values(x)
        .join(" ")
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    );

    // const resultsArray = devices.filter(
    //   (device) =>
    //     device.name.toLowerCase().includes(value) ||
    //     device.location.toLowerCase().includes(value) ||
    //     device.role.toLowerCase().includes(value) ||
    //     device.ip.toLowerCase().includes(value) ||
    // );
    // setDevices(resultsArray);
  };

  return (
    <>
      <TextField
        type="search"
        id="outlined-search"
        placeholder="Search for..."
        variant="outlined"
        onChange={handleSearchChange}
        color="first"
        focused
        sx={{ color: "#ffffff", padding: "10px 12px" }}
        InputProps={{
          endAdornment: (
            <InputAdornment sx={{ color: "white" }} position="end">
              <MdSearch />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default Search;
