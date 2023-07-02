import { JsonForms } from "@jsonforms/react";
import { Box, Button, Grid, Paper } from "@mui/material";
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
import EnrichmentDatePicker from "../components/JsonForms/DatePicker";
import EnrichmentInput from "../components/JsonForms/EnrichmentInput";
import EnrichmentAutocomplete from "../components/JsonForms/EnrichmentAutocomplete";
import { LoadingButton } from "@mui/lab";
import BannedForm from "../components/BannedForm";
import dayjs from "dayjs";
import { useEffect } from "react";

const NewMember = () => {
  const [options,setOptions] = useState([])
  const [bannedInformation, setBannedInformation] = useState({});
  //eslint-disable-next-line
  const tree = {
    "ID":"b1d4cade-b68e-43cd-bf6f-7fbdc6e28788",
    "Name":"Casino Central",
    "Childs":
      [{"ID":"76900db3-5496-45a3-8a8e-d6cb652a5b46",
        "Name":"Hall central","Childs":
          [{"ID":"762efa3c-2008-4e85-a373-b2122b151aaa",
          "Name":"SUBSUELO",
          "Childs":
            [{"ID":"ff6a33ac-e110-4b85-aa45-5354caeba7bc",
            "Name":"OFICINAS SUBSUELO",
            "Childs":[{"ID":"ed5bf50c-7ad1-4dfa-9871-780413d584c3",
            "Name":"Vestuarios"
          },
          {"ID":"1c42fdc5-5468-4ec2-b836-f7fdebed0211",
          "Name":"Deposito"
        },{"ID":"cae82d7f-ffa4-4e6c-90f8-eba7c25392c2",
          "Name":"Sala de reuniones"},{"ID":"60f8f7d9-247c-4e0b-9e6f-2e7cd6ebe9d2","Name":"Oficina de RRHH"},
          {"ID":"2e11ff23-04eb-4068-8524-00ba41cc3f31",
          "Name":"Oficina de contabilidad"},
          {"ID":"392e2c0f-b57c-44f1-a711-780f339024f5","Name":"Dto. Tecnico"},
          {"ID":"78b651f8-d052-40e5-9fb6-54263875681e","Name":"Oficina de compras"},
          {"ID":"3904dec3-1bc1-499c-878b-053f407fa99e","Name":"Oficina de Arquitectura"},
          {"ID":"b17bcdd1-a649-437e-8f04-995cd8739bb5","Name":"Comedor"},
          {"ID":"cb3171cf-2358-4c28-bba1-198afade42b5","Name":"Oficina de gerente general"}
        ]},
          {"ID":"1f588258-5f0c-467f-aff7-f79723dea233","Name":"SALAS DE JUEGO + COMIDAS","Childs":[{"ID":"e250c54c-99ba-468a-9337-baab42cc8ffc","Name":"Sala Rambla"}]}]},{"ID":"b2e3b36f-a280-4dfd-a95b-771513beb08c","Name":"PISO 1","Childs":[{"ID":"6e1f4826-090f-4e23-b775-18ad31e52ca4","Name":"OFICINAS","Childs":[{"ID":"3b662d34-0d65-41f2-b722-ebcbf40133a1","Name":"Oficina gerente operaciones"},{"ID":"f781a1c2-9d2c-48f7-9282-7aa1d922a3b5","Name":"Data center juego"},{"ID":"2db4aecc-7a07-4f2a-b0f2-67b2a530669a","Name":"Oficina Tecno Azar"},{"ID":"0505ca5e-c9eb-4e45-ad9a-2d9a518d0d3e","Name":"Oficina Auditorias"},{"ID":"9651ab89-bea0-4138-a82a-00412f47f15d","Name":"Oficina jefes juego"},{"ID":"69f8bb0c-99e0-486b-82f5-042f8e4bd998","Name":"Oficina jefes de maestranza"},{"ID":"1fb5716b-7929-4807-97aa-488403b9e965","Name":"Data center Casino Victoria"}]},{"ID":"1d4c8220-0eeb-4c11-9262-5958a50b220c","Name":"SALAS DE JUEGOS + RESTAURANTES","Childs":[{"ID":"88c69d4b-5a77-45f2-ab3b-c0d1eaa28edc","Name":"Sala Nacár"},{"ID":"8e657e82-c6d8-455f-a66b-d8e5433d3948","Name":"Sala Bristol","Childs":[{"ID":"2d4b63e0-9bfa-4ad7-aa66-e243e5471357","Name":"Escenarios Puerto de palos"}]},{"ID":"f27dfabc-b72c-4499-89e0-93b486e2363b","Name":"Sala Montecarlo"},{"ID":"3dd89ace-3c67-4198-be03-2e5790653edd","Name":"Sala Rivadavia (Fumadores)","Childs":[{"ID":"f46b6233-8d61-4866-b3dd-3baa7569470e","Name":"Barra Puerto de palos"}]},{"ID":"c95db738-3c19-45b9-a170-3ce6c0840992","Name":"Sala Paris"},{"ID":"823a3094-33f1-41a0-a09f-3865875ab3d7","Name":"Sala Terraza"},{"ID":"58524276-5ffb-4dbf-8d5d-891113a78ffa","Name":"Sala Barra bar"},
          {"ID":"b69fed0b-567b-4bcb-8113-d68f16793d17",
          "Name":"Sala restaurante Oval",
          "Childs":
            [{"ID":"35ea0b17-128c-4825-90f0-911cc7138c2f",
          "Name":"Restaurante Puerto de palos"}]}]}]}]}]}

    const findOnTree = (item, filtro) => {
      if (item.Childs) {
        let ret = [];
        for (let i = 0; i < item.Childs.length; i++) {
          const res = findOnTree(item.Childs[i], filtro);
          if (res !== false) {
            ret.push(res);
          }
        }
        ret = ret.flat();
        for (let w = 0; w < ret.length; w++) {
          ret[w].Parents.push(item.Name);
        }
        if (item?.Name?.toLowerCase().indexOf(filtro.toLowerCase()) > -1) {
          ret.push({ ID: item.ID, Name: item.Name, Parents: [] });
        }
        return ret;
      }
      if (item?.Name?.toLowerCase()?.indexOf(filtro.toLowerCase()) > -1) {
        return { ID: item.ID, Name: item.Name, Parents: [] };
      }
      return false;
    };

  const enrichmentInput = EnrichmentInput({ type: "create" });
  const enrichmentAutocomplete = EnrichmentAutocomplete({options : options, tree:tree, findOnTree:findOnTree  })
  const enrichmentDatePicker = EnrichmentDatePicker({ type: "create" });

 
  
             
  
  const renderers = useMemo(
    () => [
      ...materialRenderers,
      LayoutArray,
      ComponentAvatar,
      enrichmentDatePicker,
      enrichmentInput,
      ComponentInteractionChannel,
      enrichmentAutocomplete
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
  const [isLoading, setIsLoading] = useState();
  const [data, setData] = useState({
    ContactMethods: [1],
  });
  
  useEffect(()=>{
    
  },[data])

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
    const base64 = data.Avatar;
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (data.Email && !emailRegex.test(data.Email)) {
      NotifyUser.Warning("Ingrese un email válido.");
      return;
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

    if (dayjs(data.Birthdate).isAfter(dayjs())) {
      NotifyUser.Warning("No se pueden ingresar fechas futuras.");
      return;
    }

    if (
      data.ContactMethods &&
      (data.ContactMethods[0].Value.Number === 0 ||
        data.ContactMethods[0].Value === "")
    ) {
      NotifyUser.Warning("Debe contener al menos un número de contacto.");
      return;
    }

    setIsLoading(true);
    Post("/member/v1", {
      Name: data.Name,
      Lastname: data.Lastname,
      Email: data.Email,
      Birthdate: data.Birthdate,
      LegalID: data.LegalID,
      Address: data.Address,
      ContactMethods: data.ContactMethods,
      Banned: bannedInformation.Mode && [bannedInformation],
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
                    setIsLoading(false);
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
          setIsLoading(false);
          navigate(`/front-desk/check-in/confirm`);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (bannedInformation.LegalID === data.LegalID) {
            NotifyUser.Warning(
              "El documento autorizante no debe coincidir con el miembro próximo a adherirse al programa."
            );
          } else {
            NotifyUser.Warning("Complete los datos correctamente por favor.");
          }
          setIsLoading(false);
          return;
        } else if (error.response.status === 409) {
          setIsLoading(false);
          NotifyUser.Warning("Ya existe un usuario con el mismo documento.");
          return;
        } else {
          setIsLoading(false);
          NotifyUser.Error(
            `Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${error.response.status}).`
          );
          return;
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end ",
              marginTop: "10px",
            }}
          >
            <BannedForm
              bannedInformation={bannedInformation}
              setBannedInformation={setBannedInformation}
            />
          </Box>

          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={renderers}
            validationMode={"ValidateAndHide"}
            onChange={({ errors, data }) => {
              const arrObjs = findOnTree(tree , data.Autocomplete)
              setData(data);
            }}
          />
          {isLoading ? (
            <LoadingButton
              loading={isLoading}
              disabled
              variant="contained"
              sx={{width: "100%", marginTop: "10px", marginBottom: "30px", height:"5%"}}>
            </LoadingButton>
          ) : (
            <Button
              sx={{ width: "100%", marginTop: "10px", marginBottom: "30px" }}
              variant="contained"
              onClick={handleSubmit}
            >
              Agregar
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NewMember;
