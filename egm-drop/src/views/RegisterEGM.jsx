import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField } from '@mui/material'
import { ApiContext } from '@oc/api-context'
import { ConfigContext } from '@oc/config-context'
import { NotifyUserContext } from '@oc/notify-user-context'
import React, { useContext,  useLayoutEffect, useState } from 'react'
import Tokens from '../components/by egm/Tokens'

const RegisterEGM = () => {
  const config = useContext(ConfigContext);
  const { Post } = useContext(ApiContext);
  const [ denominations, setDenominations ] = useState({});
  const [ machineID, setMachineID ] = useState("");
  const NotifyUser = useContext(NotifyUserContext);
  const [ refreshDenominations, setRefreshDenominations ] = useState(true);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ disabledTextField, setDisabledTextField ] = useState(false);
  const [ openDialog, setOpenDialog ] = useState(false);


  useLayoutEffect(() => {
    if(refreshDenominations){ 
      const obj = {};
    if (config.Tokens) {
      // eslint-disable-next-line 
      Object.keys(config.Tokens).map((token) => {
        // eslint-disable-next-line 
        obj[token] = {};
        // eslint-disable-next-line 
        Object.keys(config.Tokens[token].Values).map((value) => {
          obj[token][
            `${config.Tokens[token].Values[value].Format}:${config.Tokens[token].Values[value].Value}`
          ] = 0;
        });
      });
      setRefreshDenominations(false);
      setDenominations(obj);
    }
  };
  // eslint-disable-next-line 
  }, [refreshDenominations]);

  const handleTokenChange = (e, tokenKey, token) => {
    setDenominations({...denominations, [tokenKey] : {
      ...denominations[tokenKey], 
      [`${token.Format}:${token.Value}`] : parseInt(e.target.value)
      } 
    })    
  };


  const postRegistration = () => {
    let objeto = {};
    let obj;
    // eslint-disable-next-line 
    Object.keys(denominations).map((token) => {
      obj = { [token]: [] };
      // eslint-disable-next-line 
      Object.keys(denominations[token]).map((values) => {
        let value = values.split(":");
        obj[token].push({
          Format: value[0],
          Value: Number(value[1]),
          Quantity: denominations[token][values],
        });
        Object.assign(objeto, obj);
      });
    });
    setIsLoading(true)
    setDisabledTextField(true)
    Post("/register/v1/egm-drop", {
      ID: machineID,
      TokenCounters: objeto
    }).then((data) => {
      // if(data.data[200]) {
      //   setOpenDialog(true);
      //   setIsLoading(false);
      //   setRefreshDenominations(true);
      //   return;
      // }
      NotifyUser.Success("¡El registro se realizó con éxito!");
      setRefreshDenominations(true);
      setMachineID("");
      setDisabledTextField(false)
      setIsLoading(false)
    })
    .catch((err) => {
      NotifyUser.Error("No se pudo realizar el registro correctamente, verifica los datos ingresados e intenta nuevamente.")
      setRefreshDenominations(true);
      setDisabledTextField(false);
      setIsLoading(false);
    })
  };

  const validationButton = () => {
    if(machineID.length > 3) {
      return true
    }
  };

  const handleKeyPressToken = (e) => {
    const allowedChars = /[0-9]/;
    const charCode = e.charCode;
    const char = String.fromCharCode(charCode);
    if (!allowedChars.test(char)) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Grid container sx={{width:"100%", height:"100%", alignItems: "center"}}>  
        <Grid sx={{width:"100%", height: {xl: "90%", md:"95%", sm:"95%"}, display:"flex", alignItems: "center",justifyContent: "center", gap: "15px"}}>
          <Grid item sx={{width: { md: Object.keys(config.Tokens).length >= 2 ? "15%" : "25%", lg: Object.keys(config.Tokens).length >= 2 ? "15%" :"20%" }, height: "100%", display:"flex", justifyContent:"center"}}>
            <Paper sx={{ height: "min-content", padding:{xl: "20px", md:"15px", sm:"7px"} }}>
              <TextField sx={{ width:"100%" }}
                  label="N° de Máquina"
                  onKeyPress={handleKeyPressToken}
                  onChange={(e) => setMachineID(e.target.value)}
                  value={machineID}
                  disabled={disabledTextField}
              />
            </Paper>
          </Grid>
          <Grid item sx={{maxWidth:"80%", height: "100%", display:"flex", flexDirection:"column", justifyContent: "space-between", alignItems: Object.keys(config.Tokens).length >= 2 && "center"}}>
            <Grid sx={{display:"flex", justifyContent:"center", height:{ xl:"85%", sm:"95%" }}}>
              <Tokens token={config.Tokens}
                onChange={handleTokenChange}
                handleKeyPressToken={handleKeyPressToken}
                denominations={denominations}
              />
            </Grid>
            {isLoading ?
              <LoadingButton
              sx={{ height:"7%", width: Object.keys(config.Tokens).length >= 2 ? "30%" : "100%"}}
              loading={true}
              loadingPosition="center"
              variant="contained"
              >
              </LoadingButton>
            :
              <Button 
                disabled={!validationButton()}
                variant='contained'
                sx={{padding: { xl: "15px" }, width: Object.keys(config.Tokens).length >= 2 ? "30%" : "100%"}} 
                onClick={postRegistration} 
              > Confirmar
              </Button>
            }
            
            </Grid>
        </Grid>
      </Grid>

      <Dialog open={openDialog}>
        <DialogTitle>
          El arqueo no fue realizado con éxito.
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          Volvé a ingresar los datos nuevamente por favor.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setOpenDialog(false)} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default RegisterEGM;