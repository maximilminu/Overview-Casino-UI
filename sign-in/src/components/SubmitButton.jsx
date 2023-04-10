import React from "react";
import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
const SubmitButton = ({ watch, errors, isLoading, handleSubmit }) => {
  return (
    <>
      {watch("SignInId") === undefined ||
      watch("SignInId") === "" ||
      watch("Password") === undefined ||
      watch("Password") === "" ||
      errors.Password?.type === "pattern" ||
      errors.SignInId?.type === "pattern" ? (
        <>
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
        </>
      ) : (
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          sx={{
            height: "5vh",
            width: "100%",
            transition: "500ms",
            backgroundColor: "primary",
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
