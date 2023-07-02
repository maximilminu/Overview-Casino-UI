import { Backdrop, Box, Grid, Paper } from "@mui/material";
import React, { useState, useMemo } from "react";
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
import {
  Outlet,
  useOutlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import * as jsonpatch from "fast-json-patch/index.mjs";
import EnrichmentDatePicker from "../components/JsonForms/DatePicker";
import EnrichmentInput from "../components/JsonForms/EnrichmentInput";
import BannedForm from "../components/BannedForm";
import { useEffect } from "react";
import Roulette from "../components/Spinner/Roulette";
import dayjs from "dayjs";

const EditMember = () => {
  //eslint-disable-next-line
  const { member, setMember, isUnauthorize, setIsUnauthorize } = useOutletContext();
  const ifOutlet = useOutlet();
  const NotifyUser = useContext(NotifyUserContext);
  const { Patch} = useContext(ApiContext);
  const { id } = useParams();
  const [savedMemberInfo, setSavedMemberInfo] = useState({});
  const [data, setData] = useState({});
  const [bannedInformation, setBannedInformation] = useState({});
  //eslint-disable-next-line
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const enrichmentInput = EnrichmentInput({ debounced: 3000 });
  const enrichmentDatePicker = EnrichmentDatePicker();
  const [dataBanned, setDataBanned] = useState({});
  //eslint-disable-next-line
  const renderers = useMemo(
    () => [
      ...materialRenderers,
      LayoutArray,
      ComponentAvatar,
      enrichmentDatePicker,
      enrichmentInput,
      ComponentInteractionChannel,
    ],
    //eslint-disable-next-line
    []
    //eslint-disable-next-line
  );

  useEffect(() => {
    if (member.Name) {
      fixAndSetData(member);
    }
    //eslint-disable-next-line
  }, [member]);

  const fixAndSetData = (data) => {
    setSavedMemberInfo(data);
    // Parsea los numeros en formato string a number.
    data.ContactMethods?.map((contactInfo) => {
      if (typeof contactInfo.Value === "object") {
        contactInfo.Value.Number = +contactInfo.Value.Number;
      }
      return true;
    });
    setData(data);
    if (data && data.Banned) {
      const info = data.Banned.find((key) => !key.FinishedAt);
      if (info) {
        setDataBanned({ Banned: [info] });
      }
    }
  };

  // eslint-disable-next-line
  const handleFormDataChange = ({ data, errors }) => {
    const patch = jsonpatch.compare(savedMemberInfo, data);
    const filteredErrors = errors.filter(
      (err) =>
        err.instancePath.indexOf("ContactMethod") < 0 &&
        err.instancePath.indexOf("Birthdate") < 0
    );

    if (filteredErrors.length > 0) {
      NotifyUser.Error("Error ", filteredErrors);
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (data.Email && !emailRegex.test(data.Email)) {
      NotifyUser.Warning("Ingrese un email válido.");
      return;
    }
    try {
      if (filteredErrors.length === 0 && patch.length) {
        for (let i = 0; i < patch.length; i++) {
          if (patch[i].path === "/Birthdate") {
            if (data.Birthdate) {
              const date = dayjs(patch[i].value);
              if (date.isAfter(dayjs())) {
                NotifyUser.Warning("No se pueden ingresar fechas futuras.");
                return;
              }
            }
          }
        }
        if (!data.Name) {
          NotifyUser.Warning("El campo 'Nombre' es obligatorio.");
          return;
        }
        if (!data.Lastname) {
          NotifyUser.Warning("El campo 'Apellido' es obligatorio.");
          return;
        }
        if (!data.LegalID) {
          NotifyUser.Warning("El campo 'Documento' es obligatorio.");
          return;
        }
        if (!data.Birthdate) {
          NotifyUser.Warning("El campo 'Fecha de nacimiento' es obligatorio.");
          return;
        }
        if (data.ContactMethods.length === 0) {
          NotifyUser.Warning("Es obligatorio un teléfono de contacto.");
          return;
        }

        Patch(`/member/v1/${id}`, patch)
          .then(({ data }) => {
            data.ID = id
            setMember({});
            fixAndSetData(data);
            NotifyUser.Success("El campo fue actualizado con éxito");
            return;
            
          })
          .catch((error) => {
            if (error.response.status === 404) {
              console.log("CATCH Error 404 ", error.response.status);
            }

            if (error.response.status === 400) {
              NotifyUser.Warning("Complete los datos correctamente por favor.");
            } else if (
              error.response.status === 409 ||
              error.response.status === 424
            ) {
              NotifyUser.Warning(
                "Ya existe un usuario con el mismo documento."
              );
            } else {
              NotifyUser.Error(
                `Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${error.response.status}).`
              );
            }
          });
      }
    } catch (error) {
      console.log(error, "ERROR");
    }
  };

  return ifOutlet ? (
    <Outlet />
  ) : data.Name ? (
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end ",
              marginTop: "10px",
            }}
          >
            { isUnauthorize.UnderAge ? null : 
            <BannedForm
              isUnauthorize={isUnauthorized}
              dataBanned={dataBanned}
              userData={data}
              bannedInformation={bannedInformation}
              setBannedInformation={setBannedInformation}
            />
            }

          </Box>

          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={renderers}
            validationMode={"ValidateAndHide"}
            onChange={handleFormDataChange}
          />
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 100 }}
      open={true}
    >
      <Roulette />
    </Backdrop>
  );
};

export default EditMember;
