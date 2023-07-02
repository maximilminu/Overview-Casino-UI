import React, { useContext, useEffect, useLayoutEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import Barcode from "react-barcode";
import { useState } from "react";
import { ConfigContext } from "@oc/config-context";
import dayjs from "dayjs";

const TicketUI = ({ data, pathname }) => {
  const config = useContext(ConfigContext);
  // eslint-disable-next-line
  const [date, setDate] = useState(Date.now());
  const [generatedBarcode, setGeneratedBarcode] = useState();

  useEffect(() => {
    setDate(data.Date);
  }, [data]);

  useLayoutEffect(() => {
    let num = Math.floor(Math.random() * 1000000000000000000)
      .toString()
      .padStart(16, "0");
    while (num.toString().length !== 16) {
      num = Math.floor(Math.random() * 1000000000000000000)
        .toString()
        .padStart(16, "0");
    }
    num = [...num].reverse().join("");
    num = "99" + num;
    setGeneratedBarcode(num);
  }, []);

  const value = +data?.Amount;
  const backupBarcode = data?.Barcode.toString();
  let barcodePreview = backupBarcode;

  if (backupBarcode[0] === "0" && backupBarcode[1] === "0") {
    barcodePreview = backupBarcode.replace(/^.{2}/g, "99");
  }

  const parsedValue = value?.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
  });

  const barcodeFormat = barcodePreview
    ? barcodePreview.replace(
        /(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})/,
        "$1-$2-$3-$4-$5"
      )
    : data?.Barcode.toString().replace(
        /(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})/,
        "$1-$2-$3-$4-$5"
      );

  const generatedFormat = generatedBarcode?.replace(
    /(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})/,
    "$1-$2-$3-$4-$5"
  );

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "success.light",
          width: "100%",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ textAlign: "center", color: "white", fontWeight: 700 }}
          variant="h5"
        >
          VISTA PREVIA
        </Typography>
      </Paper>
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: "15px",
        }}
      >
        <Typography
          sx={{
            marginTop: { xs: "5px", md: "-10px" },
            fontSize: { xs: "1.5rem", md: "2.215rem" },
          }}
          variant="body1"
        >
          CASINO CENTRAL
        </Typography>
        <Typography sx={{ fontSize: { xs: "14px", md: "1rem" } }}>
          Av. Patricio Peralta Ramos 2100 Mar del Plata
        </Typography>
        <Typography variant="body1">VALE EN EFECTIVO</Typography>
        <Grid
          sx={{
            height: { xl: "150px", md: "100px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {pathname.includes("/ticket/pre-insert") ? (
            <Barcode
              width={1}
              height={20}
              value={barcodeFormat !== "" ? barcodeFormat : ""}
            />
          ) : (
            <>
              <Typography>*Código de ejemplo</Typography>
              <Barcode width={1} height={20} value={generatedFormat} />
            </>
          )}
        </Grid>
        <Typography>
          {data.PrintedAt
            ? dayjs(data.PrintedAt).format(config.DisplayFormats.DateAndHours)
            : dayjs(new Date()).format(config.DisplayFormats.DateAndHours)}
        </Typography>
        <Typography variant="h4">
          ${(data?.Amount ? parsedValue : "") + " "}ARS
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Grid
            item
            sx={{
              textAlign: "center",
              display: "flex",
              gap: "2.5rem",
              marginTop: "1rem",
              height: "50px",
              width: "100%",
            }}
          >
            <Typography sx={{ width: "50%" }}>
              VALIDO POR 30 DÍAS <br />
            </Typography>
            <Typography sx={{ width: "50%" }}>
              MAQUINA N°
              <br />
              {data?.PrintedIn ? "#" + data.PrintedIn : " "}
            </Typography>
          </Grid>
        </Grid>
        <Typography>Solo cobrar por caja</Typography>
      </Grid>
    </>
  );
};

export default TicketUI;
