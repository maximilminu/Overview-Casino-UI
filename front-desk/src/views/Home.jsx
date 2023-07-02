import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { MemberContext } from "../context/MemberContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { HardwareContext } from "@oc/hardware-context";
import { ConfigContext } from "@oc/config-context";

import dayjs from "dayjs"
const Home = () => {
  const [client, setClient] = useState();
  const Hardware = useContext(HardwareContext);
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
  // eslint-disable-next-line
  const [visitQuantity, setVisitQuantity] = useState(false);
  const config = useContext(ConfigContext);
  useLayoutEffect(() => {
    const int = setInterval(() => {
      Get("/visit/v1/daily-count").then(({ data }) => {
        setVisitQuantity(data.CheckInQuantity);
      });
    }, 5000);

    return () => {
      clearInterval(int);
    };
    // eslint-disable-next-line
  }, []);



  useLayoutEffect(() => {
    Hardware.ConnectAll()
      .then((ret) => {
        console.log("Devices initialized:", ret);
      })
      .catch((err) => {
        console.log("Problems connecting devices:", err);
      });
  }, []);

  useEffect(() => {
    if (!url.includes("check-in")) {
      setMember(null);
    }
    //eslint-disable-next-line
  }, [url]);

  useLayoutEffect(() => {
    if (Hardware.Device.BarcodeScanner === undefined || Hardware.Device.BarcodeScanner.status() === false) {
    NotifyUser.Error("Problemas comunicando con el scanner.")
    return;
  }
    return Hardware.Device.BarcodeScanner.onDataListener((data) => {
      if (data.includes(config && config.TicketInformation && config.TicketInformation.QrUrlCheckIn)) {
        const initialArray = data.split("/");
        const visitID = initialArray[initialArray.length - 1];
        Get(`/visit/v1/by-id/${visitID}`)
          .then(({ data }) => {
            navigate(
              `/front-desk/member-list/${data.Name}/view-single-member/${data.MemberID}/${visitID}`
            );
          })
          .catch((err) => {
            if (err.response.status === 404) {
              NotifyUser.Error(
                "No se encontraron tickets que coincidan con tu búsqueda."
              );
            }
          });
      }
      const dni = data.split("@");
      try {
        if (dni.length > 2) {
          if (dni[0] === "") {
            setClient({
              Name: dni[5],
              Lastname: dni[4],
              LegalID: dni[1].replaceAll(" ", ""),
              Birthdate: dayjs(dni[7], config.DisplayFormats.Date),
            });
          } else {
            setClient({
              Name: dni[2],
              Lastname: dni[1],
              LegalID: dni[4],
              Birthdate: dayjs(dni[6],config.DisplayFormats.Date),
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
    });
    // eslint-disable-next-line
  }, [Hardware]);

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
        })
        .catch(({ response }) => {
          if (response.status === 404) {
            setClient({});
            navigate(
              `/front-desk/add-member/${new URLSearchParams(client).toString()}`
            );
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
    navigate(`/front-desk/member-list/${data}`);
    Object.keys(navBarSearchListeners.current).forEach((listenerKey) => {
      navBarSearchListeners.current[listenerKey](data);
    });
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
        counter={visitQuantity}
      />
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
        <Outlet
            context={{
              onNavbarSearchListener,
            }}
          />

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
