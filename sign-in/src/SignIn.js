import CardLogin from "./components/CardLogin";
import LogoLeft from "./components/LogoLeft";
import { useEffect, useLayoutEffect, useState } from "react";
import { getSession } from "./services/api";
import ErrorModal from "./components/ErrorModal";
import LogoRight from "./components/LogoRight";
import { Box, useMediaQuery, useTheme } from "@mui/material";
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
          <Box sx={{ display: matches && "flex" }}>
            <LogoLeft />
            <LogoRight />
          </Box>
          <CardLogin />
        </>
      )}
    </>
  );
}

export default SignIn;
