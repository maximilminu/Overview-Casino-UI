import React from "react";
import { LoadingButton } from "@mui/lab";
import "../index.css";
import { Button, Fade, Tooltip } from "@mui/material";

const SubmitButton = ({ watch, errors, isLoading, handleSubmit }) => {
  return (
    <>
      {watch("SignInId") === undefined ||
      watch("SignInId") === "" ||
      watch("Password") === undefined ||
      watch("Password") === "" ||
      errors.Password?.type === "pattern" ||
      errors.SignInId?.type === "pattern" ? (
        <Tooltip
          arrow
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          placement="bottom"
          sx={{ fontSize: "15px", margin: "0 auto" }}
          title="La contraseña debe tener al menos 8 dígitos incluyendo 1 mayúscula, 1 minúscula, 1 caracter especial y 1 número."
        >
          <span style={{ width: "100%" }}>
            <Button
              sx={{
                height: "5vh",
                width: "100%",
                transition: "500ms",
              }}
              disabled
              variant="contained"
            >
              Ingresar
            </Button>
          </span>
        </Tooltip>
      ) : (
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          sx={{
            height: "5vh",
            width: "100%",
            transition: "500ms",
            backgroundColor: "red",
          }}
          loading={isLoading}
          onClick={handleSubmit}
        >
          Ingresar
        </LoadingButton>
      )}
    </>
  );
};

export default SubmitButton;
