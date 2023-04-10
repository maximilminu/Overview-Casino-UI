import React, { useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { MemberContext } from "../context/MemberContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { HardwareContext } from "@oc/hardware-context";

const Home = () => {
  const [client, setClient] = useState();
  const Hardware = useContext(HardwareContext)
  const NotifyUser = useContext(NotifyUserContext);
  const { Get } = useContext(ApiContext);
  const navigate = useNavigate();
  const { setMember } = useContext(MemberContext);
  const url = useLocation().pathname;
  const buttonsRef = useRef([]);
  const matches = useMatches();
  const theme = useTheme();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const [dataForCreateUser] = useState();
  const navBarSearchListeners = useRef({});
  const navBarSearchListenersIds = useRef(0);
  const location = useLocation();

  useLayoutEffect(() => {
    Hardware.ConnectAll().then(ret => {
      console.log('Devices initialized:', ret);
    }).catch(err => {
      console.log('Problems connecting devices:', err);
    })
  }, [Hardware]);
  
  useEffect(() => {
    if (!url.includes("check-in")) {
      setMember(null);
    }
    //eslint-disable-next-line
  }, [url]);

  useLayoutEffect(() => {
    if (Hardware.Device.BarcodeScanner === undefined) return;
    return Hardware.Device.BarcodeScanner.onDataListener((data) => {
      const dni = data.split("@");
      try {
        if (dni.length > 2) {
          if (dni[0] === "") {
            setClient({
              Name: dni[5],
              Lastname: dni[4],
              LegalID: dni[1].replaceAll(" ", ""),
              Birthdate: dni[7],
            });
          } else {
            setClient({
              Name: dni[2],
              Lastname: dni[1],
              LegalID: dni[4],
              Birthdate: dni[6],
            });
          }
        } else {
          const reg = data.split("\r");
          if (reg.length === 20) {
            setClient({
              Name: reg[3],
              Lastname: reg[4],
              LegalID: reg[1],
              Birthdate: reg[5],
              AreaReg8: reg[12],
            });
          }
        }
      } catch {
        NotifyUser.Warning("No se pudo leer el documento.");
      }
    })
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (client?.LegalID) {
      if (
        typeof client.Name === Number ||
        client.Birthdate === undefined ||
        client.LegalID === undefined ||
        client.Name.length < 3 ||
        client.Lastname.length < 3
      ) {
        NotifyUser.Warning(
          "No se pudo leer el documento, intente nuevamente por favor."
        );
        return;
      }
      Get(`/member/v1/by-legalID/${client.LegalID}`)
        .then(({ data }) => {
            setMember(data);
            setClient({});
            navigate("check-in/confirm");
          
          // else {
          //   const info = new URLSearchParams(client).toString();
          //   if (url.includes("/front-desk/check-in/confirm")) {
          //     setOpenDialog(true);
          //     setDataForCreateUser(info);
          //     return;
          //   }
            
        })
        .catch(({response}) => {
          if (response.status === 404) {
            setClient({});
            navigate(`/front-desk/add-member/${new URLSearchParams(client).toString()}`);
          } else {
            NotifyUser.Error(
              `Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${response.status}).`
            );
          }
        });
    }
    // eslint-disable-next-line
  }, [client]);

  const onSearch = (data) => {
    if (location.pathname === "/front-desk") {
      navigate(`/front-desk/member-list/${data}`);
      Object.keys(navBarSearchListeners.current).forEach((listenerKey) => {
        navBarSearchListeners.current[listenerKey](data);
      });
    }
  };

  const onNavbarSearchListener = (listener) => {
    const id = navBarSearchListenersIds.current++;
    navBarSearchListeners.current[id] = listener;
    return () => {
      delete navBarSearchListeners.current[id];
    };
  };

  return (
    <>
      <Navbar
        onHeightChange={setHeaderHeight}
        buttonsRef={buttonsRef}
        onSearch={onSearch}
      />{" "}
      <Box
        component="main"
        sx={{
          position: "fixed",
          top: headerHeight,
          bottom: footerHeight,
          left: 0,
          right: 0,
          overflow: down600px ? "auto" : "hidden",
          backgroundColor: matches.length > 1 && "#eeeeeeb0",
        }}
      >
        { (!Hardware.Device.BarcodeScanner.status() || !Hardware.Device.Printer.status() || !Hardware.Device.Camera.status()) ? 'Error de configuración de terminal. Para poder correr esta aplicación necesita al menos una Impresora, un Scanner y una Cámara.' :
          <Outlet
            context={{
              onNavbarSearchListener,
            }}
          />
        }
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title={"Estas seguro que quiere salir del Check-in"}
          onConfirm={() => {
            setOpenDialog(false);
            navigate(`/front-desk/add-member/${dataForCreateUser}`);
          }}
        />
      </Box>
      <Footer onHeightChange={setFooterHeight} />
    </>
  );
};

export default Home;
