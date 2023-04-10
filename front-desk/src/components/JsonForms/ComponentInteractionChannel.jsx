import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { rankWith } from "@jsonforms/core";
import { debounce } from "lodash";
import {
  FormControl,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import {
  withJsonFormsDispatchCellProps,
  withJsonFormsLayoutProps,
} from "@jsonforms/react";
import InteractionChannelIcon, {
  KnownInteractionChannelIcons,
} from "../JsonForms/InteractionChannelIcon";
import { TYPING_DEBOUNCE } from "../../constants";

// ESTE COMPONENTE NO ESTA RECIBIENDO LA INFO DE LA BASE DE DATOS.
const renderer = withJsonFormsDispatchCellProps(
  withJsonFormsLayoutProps(({ schema, data, path, handleChange }) => {
    if (data.Type === "phone") {
      if (data.Value?.IsMobile) {
        data.Type = "cellphone";
      } else {
        data.Type = "landphone";
      }
    }

    const [media, setMedia] = useState(data?.Type || "cellphone");
    const [mediaData, setMediaData] = useState(data.Value || "");
    // eslint-disable-next-line
    const changeDebounced = useCallback(
      debounce((m, md) => {
        if (m === "landphone" || m === "cellphone") {
          m = "phone";
        }
        handleChange(
          path,
          Object.assign({}, data, {
            Type: m,
            Value: md,
          })
        );
      }, TYPING_DEBOUNCE),

      []
    );

    useLayoutEffect(() => {
      switch (media) {
        case "cellphone":
          if (typeof mediaData !== "object") {
            setMediaData({
              Country: 54,
              Region: 11,
              Number: 0,
              IsMobile: true,
            });
          } else {
            const m = Object.assign({}, mediaData, { IsMobile: true });
            setMediaData(m);
          }
          break;
        case "landphone":
          if (typeof mediaData !== "object") {
            setMediaData({
              Country: 54,
              Region: 11,
              Number: 0,
              IsMobile: false,
            });
          } else {
            const m = Object.assign({}, mediaData, { IsMobile: false });
            setMediaData(m);
          }
          break;
        default:
          if (typeof mediaData == "object") {
            setMediaData("");
          } else {
            setMediaData(mediaData || "");
          }
      }
      // eslint-disable-next-line
    }, [media]);

    useEffect(() => {
      changeDebounced(media, mediaData);
      // eslint-disable-next-line
    }, [media, mediaData]);

    const handleMediaDataChangeNumber = (ev) => {
      const data = { ...mediaData };
      data.Number = ev.target.value;
      setMediaData(data);
    };

    const handleMediaDataChangeRegion = (ev) => {
      const data = { ...mediaData };
      data.Region = ev.target.value;

      setMediaData(data);
    };

    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <FormControl variant="standard" margin="dense">
            <Select
              value={media}
              onChange={(ev) => setMedia(ev.target.value)}
              IconComponent={() => {}}
              sx={{
                marginRight: "2px",
                "&::before": { border: 0 },
                minWidth: "40px",
              }}
              inputProps={{ sx: { padding: "0 !important" } }}
            >
              {KnownInteractionChannelIcons.map((media) => (
                <MenuItem key={media} value={media}>
                  <InteractionChannelIcon media={media} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {media === "cellphone" ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoComplete="off"
                  label={"DDN"}
                  value={mediaData.Region}
                  variant="standard"
                  onChange={(ev) => {
                    const data = { ...mediaData };
                    data.Region = ev.target.value;
                    setMediaData(data);
                  }}
                  margin="dense"
                  required={true}
                  InputProps={{ style: { fontSize: 12, maxWidth: "40px" } }}
                />
                <Typography
                  fontSize={12}
                  sx={{
                    marginTop: "18px",
                    marginRight: "10px",
                    color: "black",
                  }}
                >
                  15
                </Typography>
                <TextField
                  autoComplete="off"
                  label={"Número"}
                  value={mediaData.Number}
                  variant="standard"
                  onChange={handleMediaDataChangeNumber}
                  margin="dense"
                  required={true}
                  InputProps={{
                    style: { fontSize: 12, width: 180 },
                  }}
                />
              </Box>
            </>
          ) : media === "landphone" ? (
            <>
              <TextField
                autoComplete="off"
                label={"Área"}
                value={mediaData.Region}
                variant="standard"
                onChange={handleMediaDataChangeRegion}
                margin="dense"
                required={true}
                InputProps={{
                  style: { fontSize: 12, maxWidth: "40px" },
                }}
              />
              <TextField
                autoComplete="off"
                label={"Número"}
                value={mediaData.Number}
                variant="standard"
                onChange={handleMediaDataChangeNumber}
                margin="dense"
                required={true}
                sx={{ marginLeft: "25px" }}
                InputProps={{
                  style: { fontSize: 12, width: 180 },
                }}
              />
            </>
          ) : (
            <TextField
              autoComplete="off"
              label={media}
              value={mediaData}
              variant="standard"
              onChange={(ev) => setMediaData(ev.target.value)}
              margin="dense"
              required={true}
              InputProps={{ style: { fontSize: 12, width: 245 } }}
            />
          )}
        </Box>
      </>
    );
  })
);

const test = (uiSchema, schema, rootSchema) =>
  schema && schema.label === "Medios de contacto";

const tester = rankWith(10, test);

const Renderer = { tester, renderer };

export default Renderer;
