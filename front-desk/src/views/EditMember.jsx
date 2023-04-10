import { Grid, Paper } from "@mui/material";
import React, { useLayoutEffect, useState, useMemo } from "react";
import ComponentInteractionChannel from "../components/JsonForms/ComponentInteractionChannel";
import schema from "../schema.json";
import uischema from "../uischema.json";
import { JsonForms } from "@jsonforms/react";
import { materialRenderers } from "@jsonforms/material-renderers";
import LayoutArray from "../components/JsonForms/LayoutArray";
import ComponentAvatar from "../components/JsonForms/ComponentAvatar";
import { NotifyUserContext } from "@oc/notify-user-context";
import { useContext } from "react";
import { ApiContext } from "@oc/api-context";
import { Outlet, useLocation, useOutlet, useParams } from "react-router-dom";
import * as jsonpatch from "fast-json-patch/index.mjs";
import Datepicker from "../components/JsonForms/DatePicker";
//import MaterialInputControl from "../components/JsonForms/MaterialInputControl";
import EnrichmentInput from "../components/JsonForms/EnrichmentInput";

const Contact = () => {
  const ifOutlet = useOutlet();
  const NotifyUser = useContext(NotifyUserContext);
  const { Get, Patch } = useContext(ApiContext);
  const { id } = useParams();
  const [savedMemberInfo, setSavedMemberInfo] = useState({});
  const currentUrl = useLocation().pathname;
  const [data, setData] = useState({});

  const enrichmentInput = EnrichmentInput({ debounced: 3000 });
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
    //eslint-disable-next-line
    []
    //eslint-disable-next-line
  );

  const fixAndSetData = (data) => {
    data.ID = id;
    data.Area = data?.Address?.Area === "undefined" ? "" : data?.Address?.Area;
    data.Country = data.Address.Country;
    data.Line1 = data.Address.Line1;
    data.Line2 = data.Address.Line2;
    data.Location = data.Address.Location;
    data.Region = data.Address.Region;
    data.Zip = data.Address.Zip;

    setSavedMemberInfo(data);
    // Parsea los numeros en formato string a number.
    data.ContactMethods?.map((contactInfo) => {
      if (typeof contactInfo.Value === "object") {
        contactInfo.Value.Number = +contactInfo.Value.Number;
      }
      return true;
    });
    // Parsea la FECHA de cumpleaños

    const dateConvert = new Date(data.Birthdate)
      .toLocaleString("es-AR")
      .split(",")[0];
    data.Birthdate = dateConvert;
    setData(data);
  };

  // Carga el miembro a editar y guarda un estado del miembro guardado en base de datos para luego comparar con la edicion.
  useLayoutEffect(() => {
    if (id) {
      Get(`/member/v1/by-id/${id}?t=${Date.now()}`)
        .then(({ data }) => {
          if (!data) {
            NotifyUser.Error("Miembro no encontrado");
            return;
          }
          fixAndSetData(data);
        })
        .catch((err) => {
          NotifyUser.Error("Error: ", err);
        });
    }

    //eslint-disable-next-line
  }, [currentUrl]);

  // eslint-disable-next-line
  const handleFormDataChange = ({ data, errors }) => {
    const patch = jsonpatch.compare(savedMemberInfo, data);
    const filteredErrors = errors.filter(
      (err) => err.instancePath.indexOf("ContactMethod") < 0
    );

    try {
      if (filteredErrors.length === 0 && patch.length) {
        // PARSEA la info de cumpleaños
        for (let i = 0; i < patch.length; i++) {
          if (patch[i].path === "/Birthdate") {
            const date = patch[i].value.split("/");
            const parseado = Date.parse(`${date[2]}-${date[1]}-${date[0]}`);
            patch[i].value = parseado;
          }
        }

        if (patch[0].path === "/Area") patch[0].path = "/Address/Area";
        if (patch[0].path === "/Line1") patch[0].path = "/Address/Line1";
        if (patch[0].path === "/Line2") patch[0].path = "/Address/Line2";
        if (patch[0].path === "/Country") patch[0].path = "/Address/Country";
        if (patch[0].path === "/Location") patch[0].path = "/Address/Location";
        if (patch[0].path === "/Region") patch[0].path = "/Address/Region";
        if (patch[0].path === "/Zip") patch[0].path = "/Address/Zip";

        if (
          data.Name?.length &&
          data.Lastname?.length &&
          data.LegalID?.length &&
          data.Birthdate?.length &&
          data.Email?.length !== 0
        ) {
          Patch(`/member/v1/${id}`, patch)
            .then(({ data }) => {
              fixAndSetData(data);
              NotifyUser.Success("El campo fue actualizado con éxito");
              return;
            })
            .catch((error) => {
              if (error.response.status === 404) {
                console.log("CATCH Error 404 ", error.response.status);
              }

              if (error.response.status === 400) {
                NotifyUser.Warning(
                  "Complete los datos correctamente por favor."
                );
              } else if (
                error.response.status === 409 ||
                error.response.status === 424
              ) {
                NotifyUser.Warning(
                  "Ya existe un usuario con el mismo documento/email."
                );
              } else {
                NotifyUser.Error(
                  `Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${error.response.status}).`
                );
              }
            });
        } else if (
          !data.Name ||
          !data.Lastname ||
          !data.LegalID ||
          !data.Birthdate ||
          !data.Email
        ) {
          NotifyUser.Warning(
            "No se pueden dejar campos obligatorios en blanco"
          );
        }
      }
    } catch (error) {
      NotifyUser.Error("Error ", error);
    }

    if (filteredErrors.length > 0) {
      NotifyUser.Error("Error ", filteredErrors);
    }
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
            onChange={handleFormDataChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Contact;
