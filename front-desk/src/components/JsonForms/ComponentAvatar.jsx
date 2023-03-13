import React, { useState, useContext } from "react";
import Webcam from "react-webcam";
import { FormControl, Fab, Box } from "@mui/material";
import { CameraContext } from "@oc/camera-context";
import { PhotoCamera, ChangeCircle } from "@mui/icons-material";
import {
	withJsonFormsDispatchCellProps,
	withJsonFormsLayoutProps,
} from "@jsonforms/react";
import { rankWith, scopeEndsWith } from "@jsonforms/core";
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import Avatar from "../Avatar";
import { useLayoutEffect } from "react";

const style = {
	box: {
		margin: "dense",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		marginTop: "-35px",
	},
	avatar: {
		color: "black",
		width: 180,
		zIndex: -10000,
		height: 180,
		margin: "0 auto",
	},
	fab: {
		position: "absolute",
		bottom: 5,
		zIndex: 100,
		left: 65,
		backgroundColor: "#d03c31",
		"&:hover": {
			backgroundColor: "#3c3c43",
		},
	},
};
const renderer = withJsonFormsDispatchCellProps(
	withJsonFormsLayoutProps(({ data, schema }) => {
		const { Camera } = useContext(CameraContext);
		const [takingPicture, setTakingPicture] = useState(false);
		const [picture, setPicture] = useState(false);
		const { Post } = useContext(ApiContext);
		const NotifyUser = useContext(NotifyUserContext);

		// console.log("DATA!!", data)

		useLayoutEffect(() => {
			setTakingPicture(Boolean(data.ID) === false);
		}, [data.ID]);

		// useEffect(() => {
		//   if (data.ID) {
		//     Get(`/storage/avatar/${data.ID}/1000?t=${Date.now()}`).then((res) => {
		//       setPicture(res);
		//       setSavedPicture(res);
		//     });
		//   }
		//   // eslint-disable-next-line
		// }, [data.ID]);

		// useEffect(() => {
		//   if (picture && data.ID) {
		//     const base64 = picture;
		//     fetch(base64)
		//       .then((res) => res.blob())
		//       .then((blob) => {
		//         const fd = new FormData();
		//         const file = new File([blob], `avatar${data.Name}.jpg`, {
		//           type: "image/jpeg",
		//         });
		//         fd.append("file", file);
		//         try {
		//           Post(`/storage/avatar/${data.id}`, fd)
		//             .then((res) => {
		//               setSavedPicture(picture);
		//               NotifyUser.Success("Imagen actualizada correctamente.", res);
		//             })
		//             .catch((error) => {
		//               if (error.request.status === 400) {
		//                 NotifyUser.Warning(
		//                   "No se ha podido guardar la imagen.",
		//                   error
		//                 );
		//               }
		//             });
		//         } catch (error) {
		//           NotifyUser.Error("Error: ", error);
		//         }
		//       });
		//   }
		//   // eslint-disable-next-line
		// }, [picture]);

		const webcamRef = React.useRef(null);

		const takePicture = () => {
			if (takingPicture) {
				if (Boolean(data.ID) === false) {
					setPicture(webcamRef.current.getScreenshot());
					data.Avatar = webcamRef.current.getScreenshot();
					setTakingPicture(false);
					return;
					// NotifyUser.Error("Primero guarde los datos del cliente y luego puede tomarle la foto.")
					// return;
				}
				const base64 = webcamRef.current.getScreenshot();
				fetch(base64)
					.then((res) => res.blob())
					.then((blob) => {
						const fd = new FormData();
						const file = new File([blob], `avatar${data.Name}.jpg`, {
							type: "image/jpeg",
						});
						fd.append("file", file);
						try {
							Post(`/storage/avatar/${data.ID}`, fd)
								.then((res) => {
									NotifyUser.Success("Imagen actualizada correctamente.", res);
									setPicture(base64);
									setTakingPicture(false);
								})
								.catch((error) => {
									if (error.request.status === 400) {
										NotifyUser.Warning(
											"No se ha podido guardar la imagen.",
											error
										);
									}
								});
						} catch (error) {
							NotifyUser.Error("Error: ", error);
						}
					});
			} else {
				setTakingPicture(true);
			}
		};

		return (
			<Box sx={style.box}>
				<FormControl variant="standard" margin="dense">
					<Avatar
						sx={{ ...style.avatar, zIndex: takingPicture ? 1 : 2 }}
						subject={data}
						src={picture}
					/>
					<Avatar
						sx={{
							...style.avatar,
							marginTop: "-100%",
							zIndex: takingPicture ? 2 : 1,
						}}
					>
						{Camera.videoConstraints && (
							<Webcam
								mirrored={false}
								audio={false}
								height={180}
								ref={webcamRef}
								screenshotFormat="image/jpeg"
								width={320}
								videoConstraints={Camera.videoConstraints}
							/>
						)}
					</Avatar>

					<Fab
						aria-label="tomar foto"
						component="label"
						sx={style.fab}
						onClick={takePicture}
					>
						{takingPicture ? <PhotoCamera /> : <ChangeCircle />}
					</Fab>
				</FormControl>
			</Box>
		);
	})
);

const tester = rankWith(10, scopeEndsWith("Avatar"));
const Renderer = { tester, renderer };

export default Renderer;
