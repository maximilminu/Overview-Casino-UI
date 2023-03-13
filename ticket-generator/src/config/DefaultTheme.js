import { createTheme, useMediaQuery, useTheme } from "@mui/material";

const breackpointsTheme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			lg: 1200,
			xl: 1536,
		},
	},
});

export let theme = createTheme({
	palette: {
		primary: {
			main: "#3c3c43",
		},
		secondary: {
			main: "#d03c31",
		},
		third: {
			main: "white",
		},
	},
	components: {
		MuiInput: {
			styleOverrides: {
				root: {},
				input: {
					// color: "white",
				},
			},
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					// color: "white",
					// ".label.Mui-focused": {
					// 	color: "white",
					// },
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					autoComplete: "off",
				},
				MuiInput: {
					autoComplete: "off",
				},
			},
		},
		MuiInput: {
			styleOverrides: {
				input: {
					autoComplete: "off",
					borderColor: "white",
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					[breackpointsTheme.breakpoints.down("sm")]: {
						width: "270px",
						height: "5px",
					},
					[breackpointsTheme.breakpoints.only("md")]: {
						width: "270px",
						height: "7px",
					},
					[breackpointsTheme.breakpoints.up("lg")]: {
						height: "7px",
						width: "13vw",
					},
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				},
			},
		},
	},

	jsonforms: { input: { delete: { background: "#f44336" } } },
});
