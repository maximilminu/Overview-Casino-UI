import React, {  useMemo, useState } from "react";
import { Paper, Grid, Backdrop, Button, Box } from "@mui/material";
import Tree from "../components/AreaTree";
import { Outlet, useLocation, useNavigate, useOutlet, useOutletContext, useParams } from "react-router";
import { materialRenderers } from "@jsonforms/material-renderers";
import LayoutArray from "../components/JsonForms/LayoutArray";
import * as jsonpatch from "fast-json-patch/index.mjs";
import ComponentInteractionChannel from "../components/JsonForms/ComponentInteractionChannel";
import schema from "../schema.json";
import uischema from "../uischema.json";
import { JsonForms } from "@jsonforms/react";
import { useContext } from "react";
import { ApiContext } from "@oc/api-context";
import Roulette from "../components/Spinner/Roulette";
import ComponentAvatar from "../components/JsonForms/ComponentAvatar";
import EnrichmentInput from "../components/JsonForms/EnrichmentInput";
import EnrichmentAutocomplete from "../components/JsonForms/EnrichmentAutocomplete";
import { LoadingButton } from "@mui/lab";
import { NotifyUserContext } from "@oc/notify-user-context";
import { useEffect } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

function AreasList() {
  const {findOnTree, getAllAreas, areasTree, loadingPage, filteredTreeBySearch, setFilteredAreas, filteredAreas, areasByFindOnOnTreeFunction } = useOutletContext();
  const [savedAreaInfo, setSavedAreaInfo] = useState({});
  const NotifyUser = useContext(NotifyUserContext);
  const url = useLocation().pathname;
  const [data, setData] = useState({});
  const [ loadingPaper, setLoadingPaper ] = useState(false);
  
  const [ isLoading, setIsLoading ] = useState(false);
  const { id } = useParams();
  const ifOutlet = useOutlet();
  const { Get, Post, Patch } = useContext(ApiContext);
  const [ openConfirmDialog, setOpenConfirmDialog ] = useState(false);
  const navigate = useNavigate();
  const [onUrlListener, setOnUrlListener] = useState(false);



  const renderers = useMemo(
    () => {
      setData({});
      const enrichmentInput = EnrichmentInput((onUrlListener ? {type: "create"}:{ debounced: 3000} ))
      const enrichmentAutocomplete = EnrichmentAutocomplete({  options: filteredAreas, onSearch: findOnTree, aditionalSave:"ParentID" });

      return [
      ...materialRenderers,
      LayoutArray,
      ComponentAvatar,
      enrichmentInput,
      ComponentInteractionChannel,
      enrichmentAutocomplete
    ]},
    // eslint-disable-next-line
    [areasTree, onUrlListener]
  );

  useEffect(()=>{
    if(url.includes("new-area")){
      setData({});
      setOnUrlListener(true);
      setFilteredAreas(areasByFindOnOnTreeFunction);
      return;
    };
    setOnUrlListener(false);
    if(url.includes(":id")){
      setData({});
      getAllAreas();
    };
     // eslint-disable-next-line
  }, [url]);

  useEffect(() => {
    if(id !== ":id" && id !== undefined && Object.keys(areasTree).length > 1) {
      getAreasByID(id);
    };
     // eslint-disable-next-line
  }, [areasTree, id]);


  const getAreasByID = (id) => {
    if(id !== ":id" && id !== undefined) {
      Get(`/area/v1/by-id/${id}`).then(({ data }) => {
        const findOnTreeData = findOnTree(areasTree, false, data.ParentID);
        setFilteredAreas(findOnTreeData) ; 
        data.Parent = findOnTreeData[0] || findOnTreeData;
        setData(data);
        setSavedAreaInfo(data);
        setLoadingPaper(false);
      })
      .catch((err) => {
        NotifyUser.Warning("No se pudo obtener la información del área seleccionada. Intente más tarde.");
        setLoadingPaper(false);
      });
    };
  };

  const postNewArea = () => {
    setIsLoading(true);
    delete data.Parent
    Post("/area/v1", data).then(({data}) => {
      getAllAreas();
      NotifyUser.Success("¡El área fue creada con exito!");
      setIsLoading(false);
      navigate(`/area-managment/all-areas/${data.ID}`);
    }).catch((err) => {
      setIsLoading(false);
      if(err.response.status === 400 ) { 
        NotifyUser.Warning("El campo 'Área Padre' es obligatorio.");
      };
    });
  };

  const patchOfArea = ({errors, data}) => {
    if(data) {
      if(!data.Parent || !data.ParentID) {
        NotifyUser.Warning("El campo 'Área Padre' es obligatorio.");
        return;
      }
      if(data.Name === "" || data.Name === undefined) {
        NotifyUser.Warning("El campo 'Nombre' es obligatorio.");
        return;
      };
      const patch = jsonpatch.compare(savedAreaInfo, data);
      const patchWithoutParents = patch.filter((x) => !x.path.includes("Parent"));
      const patchWithParentID = patch.filter((x) => x.path.includes("ParentID"));

      if(patchWithParentID && patchWithParentID[0] && patchWithParentID[0].value === id){
        getAreasByID(id);
        NotifyUser.Warning("No se puede seleccionar al área seleccionada como padre de sí misma.");
        return;
      };
      if(patchWithoutParents.length > 0 && patch.length > 0) {
        Patch(`/area/v1/by-id/edit/${id}`, patchWithoutParents).then(({data}) => {
          getAreasByID(id);
          getAllAreas();
          NotifyUser.Success("¡El campo fue actualizado con éxito!");
        })
        .catch((err) => {
          NotifyUser.Warning("No se pudo actualizar la información del área. Intente más tarde.");
        })
      };
      if(patchWithParentID.length > 0 && patch.length > 0) {
        Post(`/area/v1/set-parent`, {
          AreaID: id,
          ParentID:  patchWithParentID[0].value
        }).then(({data}) => {
          getAreasByID(id);
          getAllAreas();
          NotifyUser.Success("¡El campo fue actualizado con éxito!");
        })
        .catch((err) => {
          err.response.json().then((errorData) => {
						if(errorData.error === "INVALID_PARENT") {
              NotifyUser.Error("No es posible asignar un Área de jerarquía inferior como Área Padre.");
            } else {
              NotifyUser.Warning("No se pudo actualizar la información del área. Intente más tarde.");
            }
					});
        })
      };
     };
  };

  const deleteArea = () => {
    Post(`/area/v1/by-id/delete/${id}`).then(({data}) => {
      setOpenConfirmDialog(false);
      navigate("/area-managment/all-areas/:id");
      getAllAreas();
      NotifyUser.Success("¡El área fue eliminada con exito!");
    })
    .catch((err) => {
      NotifyUser.Warning("No se pudo borrar el área. Intente más tarde.");
    });
  };

  const validationButton = () => {
    if ( !data.Name || !data.ParentID) {
      return true;
    } else {
      return false;
    };
  };

  const handleNavigate = (ID) => {
    if(id === ID ){
      return;
    }
    setLoadingPaper(true);
    navigate(`/area-managment/all-areas/${ID}`);
  };

  return ifOutlet ? (
    <Outlet />
  ) : loadingPage ? (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 100 }}
      open={true}
    >
      <Roulette />
    </Backdrop>
  ) : (
    <>
      <Grid
        container
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
        }}
      >
      {url.includes("all-areas") &&
        <Grid
          component={Paper}
          item
          xl={2.5}
          md={3}
          sm={4.5}
          sx={{ height: "100%", overflow: "auto", zIndex: (theme) => theme.zIndex.drawer + 150  }}
        >
          <Grid container sx={{ height: "inherit" }}>
            <Tree
              data={areasTree}
              filter={filteredTreeBySearch}
              onOpenCloseAll={null}
              onSearch={getAreasByID}
              rightActions={() => {}}
              onNavigate={handleNavigate}
              id={id}
            />
          </Grid>
        </Grid>
        };

        <Grid item xl={6} md={6} sm={6} sx={{ margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center" }} >
          <Grid
            item
            sx={{
              overflow: "auto",
              height: {md: "90%", xl:"80%"},
              width: { xl: "65%", md: "90%", sm:"100%" },
              display: "flex",
              justifyContent: "center",
              
            }}
            component={Paper}
          >
          {loadingPaper ?   
              <Backdrop 
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 150, backgroundColor:"unset", left: { md: "25%", xl:"15%" } }}
              open={true}
            >
              <Roulette />
            </Backdrop> 
            : 
            <Grid item sx={{ width: "80%", display: "flex", flexDirection:"column", height: {xl : "90%", md:"95%"}, alignItems: "center", justifyContent:{ xl: "center", lg: "center", md:"flex-start"} }}
            > 
              {id !== ":id" && id !== undefined && data.Parent &&
                <Box sx={{display:"flex", justifyContent:"flex-end", width:"100%", paddingTop:"10px"}}>
                   <Button variant="contained" onClick={() => setOpenConfirmDialog(true)}>Eliminar área</Button>
                </Box>
              }
              {(id === ":id" || url.includes("new-area") || data.Parent) ? 
                <JsonForms
                  schema={schema}
                  uischema={uischema}
                  data={data}
                  renderers={renderers}
                  onChange={({ errors, data }) => {
                    if(id !== ":id" && id !== undefined) {
                      patchOfArea({errors, data});
                    } else {
                      setData(data);
                    };
                  }}
                />
                : 
                <Backdrop 
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 150, backgroundColor:"rgba(0, 0, 0, 0.3)", left: { md: "25%", xl:"15%" } }}
                open={true}
              >
                <Roulette />
              </Backdrop>
              }
              {url.includes("new-area") && 
                (isLoading ? (
                  <LoadingButton
                  loading={isLoading}
                  disabled
                  variant="contained"
                  sx={{width: "100%", marginBottom: { sm:"25px", md:"25px"}, height:"5%"}}>
                </LoadingButton>
                ) : (
                  <Button
                    sx={{ width: "100%", marginBottom: { sm:"25px", md:"25px"} }}
                    disabled={validationButton()}
                    variant="contained"
                    onClick={postNewArea}
                  >
                    Agregar
                  </Button>
                ))
              }
            </Grid>
            }
          </Grid>
        </Grid> 
      </Grid>

        <ConfirmDialog 
          open={openConfirmDialog} 
          title={"¿Desea confirmar la operación?"}
          onCancel={() => setOpenConfirmDialog(false)} 
          onConfirm={deleteArea}
        />
    </>
  );
};

export default AreasList;
