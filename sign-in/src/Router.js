import CardLogin from "./components/CardLogin";
import { useEffect, useLayoutEffect, useState } from "react";
import { getSession } from "./services/api";
import ErrorModal from "./components/ErrorModal";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
function SignIn() {
  const theme = useTheme();
  const [sessionId, setSessionId] = useState("sessionId");
  const [error, setError] = useState(false);
  const [showError, setShowError] = useState();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  useLayoutEffect(() => {
    getSession()
      .then((resp) => setSessionId(resp))
      .catch((error) => {
        setError([
          `Problemas al conectar con el servidor, contactarse con soporte técnico (${error.message})`,
        ]);
        setShowError(true);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

  return (
    <>
      {showError ? (
        <ErrorModal message={error} />
      ) : (
        <>
        <CssBaseline />
          <Box
            sx={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              overflow: "hidden",
              backgroundColor: matches.length > 1 && "#eeeeeeb0",
            }}
            component="main"
          >
          <CardLogin />
          </Box>




          {/* <Box sx={{ display: matches && "flex" }}>
            <LogoLeft />
            <LogoRight />
          </Box>
          <CardLogin /> */}
        </>
      )}
    </>
  );
}

export default SignIn;
