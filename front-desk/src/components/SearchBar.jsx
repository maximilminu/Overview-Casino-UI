import React, { useState, useCallback, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, Box, InputAdornment, IconButton } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Cancel } from "@mui/icons-material";
import Typing from "./Spinner/typing/Typing";
import debounce from "lodash.debounce";
import { useLocation } from "react-router-dom";

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
	position: "relative",
	color: "inherit",
	"& .MuiInputBase-input": {
		// backgroundColor:"red"
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
	"& .MuiFormHelperText-root": {
		color: "white ",
		position: "absolute",
		top: 36,
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
	disable = false,
}) => {
	const [typing, setTyping] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [helperText, setHelperText] = useState(null);
	// eslint-disable-next-line

	const callbackHandle = useCallback(
		debounce((data) => {
			setTyping(false);
			if (data.length < minChars) {
				setHelperText(
					`Se necesita ingresar al menos ${minChars} caracteres para realizar una busqueda`
				);
				return;
			}
			setHelperText("");
			onSearch(data);
		}, debounceTimeout),
		[]
	);
	useEffect(() => {
		if (searchText === "" || searchText === " ") {
			setHelperText("");
		}
		// eslint-disable-next-line
	}, [searchText, typing]);

	const handleSearchChange = (e) => {
		const searchText = e.target.value;
		if (searchText.length === 0) {
			setSearchText("");
			setHelperText("");
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
		// console.log(arrUrl)
		// console.log(arrUrl.indexOf(value),"position")
		// console.log(arrUrl.length-1)

		if (value === "") {
			setSearchText("");
			setHelperText("");
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
					<SearchIcon
						style={disable ? { color: "gray" } : { color: "white" }}
					/>
				</SearchIconWrapper>
				<StyledTextField
					disabled={disable}
					autoComplete="off"
					value={searchText}
					onChange={handleSearchChange}
					placeholder="Buscar…"
					helperText={helperText}
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
											if (!disable) {
												setSearchText("");
												if (onEmpty) {
													onEmpty();
												}
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
