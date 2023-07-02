import React, { useState, useContext } from "react";
import Webcam from "react-webcam";
import { FormControl, Fab, Box, useTheme } from "@mui/material";
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
import { HardwareContext } from "@oc/hardware-context";
import { useEffect } from "react";

const renderer = withJsonFormsDispatchCellProps(
  withJsonFormsLayoutProps(({ data, schema }) => {
    const [takingPicture, setTakingPicture] = useState(false);
    const [picture, setPicture] = useState(false);
    const { Post } = useContext(ApiContext);
    const NotifyUser = useContext(NotifyUserContext);
    const theme = useTheme();
    const Hardware = useContext(HardwareContext);
    const style = {
      box: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "15px",
      },
      avatar: {
        color: "black",
        width: 145,
        zIndex: -10000,
        height: 145,
        margin: "0 auto",
      },
      fab: {
        position: "absolute",
        bottom: 0,
        zIndex: 100,
        left: 45,
        color: "white",
        backgroundColor: "primary.main",
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      },
    };



    useEffect(() => {
      if(Hardware.Device && Hardware.Device.Camera && Hardware.Device.Camera.status() === true){
        console.log("Camera connected!")
      } else {
        NotifyUser.Error("Problemas comuncando con la cámara.")
      }
      // eslint-disable-next-line
    }, [Hardware])
    

    useLayoutEffect(() => {
      setTakingPicture(Boolean(data.ID) === false);
    }, [data.ID]);

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

        const modifySizeImage = new Image();
        modifySizeImage.onload = () => {
          console.log(
            modifySizeImage.naturalWidth,
            modifySizeImage.naturalHeight
          );
          const canvas = document.createElement("canvas");

          const dimension = Math.min(
            modifySizeImage.naturalWidth,
            modifySizeImage.naturalHeight
          );
          const x = (modifySizeImage.naturalWidth - dimension) / 2;
          const y = (modifySizeImage.naturalHeight - dimension) / 2;
          const size = dimension;

          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(modifySizeImage, x, y, size, size, 0, 0, size, size);
          const newBase64 = canvas.toDataURL("image/jpeg");

          fetch(newBase64)
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
                    NotifyUser.Success(
                      "Imagen actualizada correctamente.",
                      res
                    );
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
        };
        modifySizeImage.src = base64;
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
            <Webcam
              mirrored={false}
              audio={false}
              height={180}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              videoConstraints={Hardware.Device && Hardware.Device.Camera && Hardware.Device.Camera.videoConstraints}
            />
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
