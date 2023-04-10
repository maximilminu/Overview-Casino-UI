import { JsonForms } from "@jsonforms/react";
import { Button, Grid, Paper } from "@mui/material";
import React, { useLayoutEffect, useMemo, useState } from "react";
import schema from "../schema.json";
import uischema from "../uischema.json";
import { materialRenderers } from "@jsonforms/material-renderers";
import LayoutArray from "../components/JsonForms/LayoutArray";
import ComponentAvatar from "../components/JsonForms/ComponentAvatar";
import ComponentInteractionChannel from "../components/JsonForms/ComponentInteractionChannel";
import { useContext } from "react";
import { ApiContext } from "@oc/api-context";
import { MemberContext } from "../context/MemberContext";
import { NotifyUserContext } from "@oc/notify-user-context";
import { Outlet, useLocation, useNavigate, useOutlet } from "react-router-dom";
import Datepicker from "../components/JsonForms/DatePicker";
//import MaterialInputControl from "../components/JsonForms/MaterialInputControl";
import EnrichmentInput from "../components/JsonForms/EnrichmentInput";
import moment from "moment";

const NewMember = () => {
  const enrichmentInput = EnrichmentInput({ type: "create" });
  //eslint-disable-next-line
  const renderers = useMemo(
    () => [
      ...materialRenderers,
      LayoutArray,
      ComponentAvatar,
      Datepicker,
      enrichmentInput,
      ComponentInteractionChannel,
    ],
    // eslint-disable-next-line
    []
  );

  const ifOutlet = useOutlet();
  const { setMember } = useContext(MemberContext);
  const navigate = useNavigate();
  const { Post } = useContext(ApiContext);
  const NotifyUser = useContext(NotifyUserContext);
  const url = useLocation().pathname.slice(23);
  const currentUrl = useLocation().pathname;
  const urlParams = new URLSearchParams(url);
  const [data, setData] = useState({});

  useLayoutEffect(() => {
    const capitalizer = (word) => {
      const result = word.split(" ").map((singleWord) => {
        return (
          singleWord.charAt(0).toUpperCase() + singleWord.slice(1).toLowerCase()
        );
      });
      return result.join(" ");
    };

    setData({
      Name: capitalizer(urlParams?.getAll("Name").toString()),
      Lastname: capitalizer(urlParams?.getAll("Lastname").toString()),
      LegalID: urlParams?.getAll("LegalID").toString(),
      Birthdate: urlParams?.getAll("Birthdate").toString(),
    });
    // eslint-disable-next-line
  }, [currentUrl]);

  const handleSubmit = () => {
    const birthdate = data.Birthdate.split("/");
    const date = new Date(`${birthdate[2]}, ${birthdate[1]}, ${birthdate[0]}`);
    var myEpoch = date.getTime();
    const today = new Date().getTime();
    const base64 = data.Avatar;

    const birthdate2 = data.Birthdate;
    const date2 = moment(birthdate2, "DD-MM-YYYY");

    if (!date2.isValid()) {
      // Manejar la fecha inválida aquí
      NotifyUser.Warning("La fecha ingresada es inválida");
      return;
    }

    if (myEpoch >= today) {
      NotifyUser.Warning("No se pueden ingresar fechas futuras");
      return;
    }

    Post("/member/v1", {
      Name: data.Name,
      Lastname: data.Lastname,
      Email: data.Email,
      Birthdate: myEpoch,
      LegalID: data.LegalID,
      Address: {
        Area: data.Area,
        Country: data.Contry,
        Line1: data.Line1,
        Line2: data.Line2,
        Location: data.Location,
        Region: data.Region,
        Zip: data.Zip,
      },
      ContactMethods: data.ContactMethods,
    })
      .then(({ data }) => {
        setData({});
        setMember(data);

        const modifySizeImage = new Image();
        modifySizeImage.onload = () => {
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

          if (newBase64 !== undefined) {
            fetch(newBase64)
              .then((data) => data.blob())
              .then((blob) => {
                const fd = new FormData();
                const file = new File([blob], `avatar${data.Name}.jpg`, {
                  type: "image/jpeg",
                });
                fd.append("file", file);
                Post(`/storage/avatar/${data.ID}`, fd)
                  .then(({ data }) => {
                    NotifyUser.Success("Imagen subida correctamente");
                    navigate(`/front-desk/check-in/confirm`);
                  })
                  .catch((error) => {
                    console.log("ERROR");
                    if (error.request.status === 400) {
                      NotifyUser.Warning(
                        "no se ha podido guardar la imagen",
                        error
                      );
                    }
                  });
              });
          }
        };
        modifySizeImage.src = base64;
        if (!base64) {
          navigate(`/front-desk/check-in/confirm`);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          NotifyUser.Warning("Complete los datos correctamente por favor.");
        } else if (error.response.status === 409) {
          NotifyUser.Warning(
            "Ya existe un usuario con el mismo documento/email."
          );
        } else {
          NotifyUser.Error(
            `Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${error.response.status}).`
          );
        }
      });
  };

  return ifOutlet ? (
    <Outlet />
  ) : (
    <Grid
      container
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        item
        component={Paper}
        sx={{
          overflow: "auto",
          height: "90%",
          width: { xl: "40%", md: "60%" },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid item sx={{ width: "80%" }}>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={renderers}
            onChange={({ errors, data }) => {
              setData(data);
              console.log(data);
            }}
          />

          <Button
            sx={{ width: "100%", marginBottom: "40px" }}
            variant="contained"
            onClick={handleSubmit}
          >
            Agregar
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NewMember;
