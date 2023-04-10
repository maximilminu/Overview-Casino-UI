import React, { useState, useCallback, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, Box, InputAdornment, IconButton } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Cancel } from "@mui/icons-material";
import Typing from "./typing/Typing";
import debounce from "lodash.debounce";

const StyledContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: "90px",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "15px",
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,

    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "30vw",
      "&:focus": {
        width: "30vw",
      },
    },
  },

  "&	.MuiOutlinedInput-root": { color: "inherit" },
}));

const Search = ({
  onEmpty,
  onSearch,
  onStartTyping,
  value,
  minChars = 2,
  debounceTimeout = 750,
}) => {
  const [typing, setTyping] = useState(false);
  const [searchText, setSearchText] = useState("");

  // eslint-disable-next-line
  const callbackHandle = useCallback(
    debounce((data) => {
      setTyping(false);
      if (data.length < minChars) {
        return;
      }
      onSearch(data);
    }, debounceTimeout),
    []
  );

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    if (searchText.length === 0) {
      setSearchText("");
      if (onEmpty) {
        onEmpty();
      }
    } else {
      setTyping(true);
      if (onStartTyping) {
        onStartTyping();
      }
      setSearchText(searchText);
      callbackHandle(searchText);
    }
  };

  useEffect(() => {
    if (value === "") {
      setSearchText("");
    }
    if (value) {
      setSearchText(value);
      if (value.length >= minChars) {
        onSearch(value);
      } else {
        if (onEmpty) {
          onEmpty();
        }
      }
    }
    // eslint-disable-next-line
  }, [value]);

  return (
    <>
      <Box sx={{ flexGrow: 0.6 }} />
      <StyledContainer>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledTextField
          autoComplete="off"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Buscar…"
          inputProps={{ "aria-label": "search" }}
          InputProps={{
            "aria-label": "search",
            endAdornment: (
              <InputAdornment position="end">
                {typing ? (
                  <Typing />
                ) : (
                  <IconButton
                    onClick={() => {
                      setSearchText("");
                      if (onEmpty) {
                        onEmpty();
                      }
                    }}
                  >
                    <Cancel />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </StyledContainer>
      <Box sx={{ flexGrow: 0.6 }} />
    </>
  );
};

export default Search;
