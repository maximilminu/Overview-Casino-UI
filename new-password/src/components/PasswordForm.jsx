import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	Button,
	Paper,
	Typography,
	Box,
	TextField,
	InputAdornment,
	IconButton,
  Tooltip,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { ConfigContext } from "@oc/config-context";
import { LoadingButton } from "@mui/lab";

const PasswordForm = (props) => {
	const config = useContext(ConfigContext)

	const [firstValue, setFirstValue] = useState({
		password: "",
		showPassword: false,
	});
	const [secondValue, setSecondValue] = useState({
		password: "",
		showPassword: false,
	});
	const [thirdValue, setThirdValue] = useState({
		password: "",
		showPassword: false,
	});

	const handleClickMouseOver = (value, setValue) => () => {
		setTimeout(handleClickMouseOut(value, setValue), 1500);
		setValue({
			...value,
			showPassword: true,
		});
	};

	const handleClickMouseOut = (value, setValue) => () => {
		setValue({
			...value,
			showPassword: false,
		});
	};

	
	return (
		<>
			<Paper elevation={3} sx={style.paper}>
					<Typography
						variant="h4"
						gutterBottom
						sx={{
							textAlign: "center",
							marginBottom: "2rem",
							color: "secondary.main",
						}}
					>
						{props.title}
					</Typography>

						<Box
							component="form"
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "column",
								gap: "3rem",
								width:{ xl:"60%", lg:"60%", md:"60%", xs: "90%"},
							}}
						>
						{props.firstID &&
            	<TextField
								id={props.firstID}
                disabled={props.disabled}
								onChange={props.handleChange}
								label={props.firstLabel}
								type={firstValue.showPassword ? "text" : "password"}
								variant="standard"
								sx={{
									width: "100%",
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickMouseOver(
													firstValue,
													setFirstValue
												)}
												edge="end"
											>
												{firstValue.showPassword ? (
													<VisibilityOff sx={{ color: "secondary.light" }} />
												) : (
													<Visibility sx={{ color: "secondary.light" }} />
												)}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
            }
							{props.secondID && 
                <TextField
                  id={props.secondID}
                  disabled={props.disabled}
                  onChange={props.handleChange}
                  label={props.secondLabel}
                  type={secondValue.showPassword ? "text" : "password"}
                  variant="standard"
                  // onKeyPress={}
                  sx={{
                    width: "100%",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickMouseOver(
                            secondValue,
                            setSecondValue
                          )}
                          edge="end"
                        >
                          {secondValue.showPassword ? (
                            <VisibilityOff sx={{ color: "secondary.light" }} />
                          ) : (
                            <Visibility sx={{ color: "secondary.light" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              }
							{props.thirdLabel && (
								<TextField
									id={props.thirdID}
                  disabled={props.disabled}
									onChange={props.handleChange}
									label={props.thirdLabel}
									variant="standard"
									type={thirdValue.showPassword ? "text" : "password"}
									sx={{
										width: "100%",
									}}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickMouseOver(
														thirdValue,
														setThirdValue
													)}
													edge="end"
												>
													{thirdValue.showPassword ? (
														<VisibilityOff sx={{ color: "secondary.light" }} />
													) : (
														<Visibility sx={{ color: "secondary.light" }} />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							)}

             {props.loading ?  
              <LoadingButton
                sx={{width:"65%", padding: ".8rem",}}
                // onClick={handleClick}
                loading={props.loading}
                loadingPosition="end"
                variant="contained"
              >
                <span style={{marginLeft:"20px", marginRight:"45px"}}>Redirigiendo...</span>
              </LoadingButton> 
              :  
              <Tooltip title={config.PasswordFormat.Message}>
                <span style={{width:"50%"}}>
                  <Button
                    variant="contained"
                    sx={style.button}
                    disabled={!props.validate}
                    onClick={props.handleSubmit}
                  >
                    Confirmar
                  </Button>
                </span>
              </Tooltip>
            }
					</Box>
			</Paper>
		</>
	);
};

const style = {
	paper: {
		padding: "20px",
		display: "flex",
		flexDirection:"column",
		backgroundColor: "third.main",
		justifyContent: "center",
		width: {xl : "35%", lg: "40%", md:"50%", sm:"70%", xs:"90%"},
		alignItems: "center",
	},
	input: { width: "25rem", margin: "1.5rem 0" },

	inputBox: {
		padding: "2rem",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
	},
	container: {
		marginBottom: "40px",
		height: "85vh",
		flexDirection: "column",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},

	boxButton: { display: "flex", justifyContent: "end", padding: "1.2rem" },
	button: {
		padding: ".8rem",
		backgroundColor: "primary.dark",
		color: "third.main",
		width:"100%"
	},
};

export default PasswordForm;
