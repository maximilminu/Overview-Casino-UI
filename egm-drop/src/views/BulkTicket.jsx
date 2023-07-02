import { LoadingButton } from '@mui/lab';
import {  Button, Dialog, DialogContent, Grid, Paper, TextField, Typography } from '@mui/material'
import { ApiContext } from '@oc/api-context';
import { ConfigContext } from '@oc/config-context';
import { HardwareContext } from '@oc/hardware-context';
import { NotifyUserContext } from '@oc/notify-user-context';
import React, { useContext, useEffect, useState } from 'react'
import LayoutTicket from '../components/by bulk/LayoutTicket';
import { FormatLocalDateTime, FormatLocalTime } from '../utils/Intl';

const BulkTicket = () => {
    const [ quantity, setQuantity ] = useState(0);
    const [ amount, setAmount ] = useState("");
    const { Post } = useContext(ApiContext);
    const [ arrayOfTickets, setArrayOfTickets ] = useState();
    const NotifyUser = useContext(NotifyUserContext);
    const [ loadingButton, setLoadingButton ] = useState(false);
    const Hardware = useContext(HardwareContext);
    // eslint-disable-next-line 
    const config = useContext(ConfigContext);
    // eslint-disable-next-line 
    const [ openDialog, setOpenDialog ] = useState(false)

  const handleKeyPressQuantity = (e) => {
    const allowedChars = /[0-9]/;
    const charCode = e.charCode;
    const char = String.fromCharCode(charCode);
    if (!allowedChars.test(char)) {
      e.preventDefault();
    };
  };

  const handleKeyPressAmount = (e) => {
    const allowedChars = /[0-9.,]/;
    const charCode = e.charCode;
    const char = String.fromCharCode(charCode);
    if (!allowedChars.test(char)) {
      e.preventDefault();
    };
  };

  const handleChangeAmount = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const newValue = value.replace(",", ".").replace(/\.(?=\d*\.)/g, "");
      if (newValue.length <= 15) {
        setAmount(newValue);
      };
  };

  // eslint-disable-next-line 
  const postGenerateTicket = () => {
    if(Hardware.Device.TclPrinter.status() === true ){    
    Post(`/ticket/v1/create-tickets`, {
        Quantity: quantity,
        Amount: parseFloat(amount)
    }).then(({data}) => {
        setArrayOfTickets(data);
        // NotifyUser.Success("¡Los tickets fueron creados con éxito!");
        setLoadingButton(true);
        setTimeout(() => {
          setLoadingButton(false);
          setQuantity(0);
          setAmount("");
          setArrayOfTickets([]);
          NotifyUser.Success("¡Los tickets se imprimieron con éxito!");
        }, 3000);
    })
    .catch((err) => {
      NotifyUser.Warning("Los tickets no fueron creados con éxito. Intente más tarde");
      setLoadingButton(false);
    })
  } else {
    NotifyUser.Error("Problemas comunicando con la impresora.")
  }
  };
  
  const handleChangeQuantity = (e) => {
    setQuantity(Number(e.target.value))
  };

  const validationButton = () => {
    if(quantity.toString().length >= 1 && quantity !== 0 && amount.length > 1) {
      return true
    };
  };

  useEffect(() => {

    let arr = [];
    if(arrayOfTickets){
      // eslint-disable-next-line 
      arrayOfTickets.map((ticket) => {
        arr.push(
          {
            side: "Ticket",
            validityDays: 125,
            H3: "Ticket de Demo",
            SH1: "Terminal",
            SH2: "de test",
            H1: "OVERVIEW.CASINO",
            BC1:"VALIDATION",
            BC2: ticket.Barcode,
            BBC1: FormatLocalDateTime(Date.now()),
            BBC2: FormatLocalTime(Date.now()),
            BBC3: `Vale ${ticket.ID}`,
            D1: "",
            D2: "",
            H2: `$${ticket.Amount}`,
            F1: "30 dias",
            F2: "No válido para cobrar por caja",
            Number: 9876543211,
          })      
      })
      //impresos no cobrables
      Hardware.Device.TclPrinter.print(arr);
      }
    
    
    // eslint-disable-next-line 
  },[arrayOfTickets])

  return (
        <>
          <Grid container sx={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
              <Grid item sx={{width:"40%", height:"30%", display:"flex", flexDirection:"column", alignItems: "center", paddingY: "15px"}} component={Paper}>
                  <Typography>Ingrese la cantidad e importe de los tickets que desea generar.</Typography>
                      <Grid item sx={{ width:"100%", height:"100%",display:"flex", justifyContent:"center", alignItems:"center", gap:"20px" }}>
                          <TextField 
                              label={"Cantidad"} 
                              onKeyPress={handleKeyPressQuantity}
                              onChange={handleChangeQuantity}
                              value={quantity}
                              disabled={loadingButton}
                          />
                          <TextField 
                              label={"Importe"} 
                              onKeyPress={handleKeyPressAmount}
                              onChange={handleChangeAmount}
                              value={amount === 0 ? "" : amount}
                              disabled={loadingButton}
                          />
                      </Grid>
                  {loadingButton ? 
                    <LoadingButton
                    sx={{width:"25%", height:"30%"}}
                    // onClick={postGenerateTicket}
                    loading={true}
                    loadingPosition="center"
                    variant="contained"
                    >
                    </LoadingButton>
                  :
                    <Button disabled={!validationButton()} sx={{width:"25%"}} variant="contained" 
                    onClick={postGenerateTicket}>
                      Confirmar
                    </Button>
                  }    
              </Grid>
          </Grid>

          <Dialog  
            fullWidth={true}
            maxWidth="sm"
            open={false}>
            {/* <DialogTitle></DialogTitle> */}
            <DialogContent sx={{padding:0}}>
              <LayoutTicket />
            </DialogContent>
          </Dialog>
        </>
  );
};

export default BulkTicket;