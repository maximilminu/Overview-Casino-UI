import { LoadingButton } from '@mui/lab';
import { Button, Grid,  Paper, TextField } from '@mui/material'
import { ApiContext } from '@oc/api-context';
import { ConfigContext } from '@oc/config-context'
import { NotifyUserContext } from '@oc/notify-user-context';
import React, { useContext } from 'react'
import { useLayoutEffect } from 'react';
import { useState } from 'react';

const ManualAdjustment = () => {
  const config = useContext(ConfigContext);
  const [ tokens, setTokens ] = useState({});
  const [ motive, setMotive ] = useState("");
  const { Post } = useContext(ApiContext);
  const [ loadingButton, setLoadingButton ] = useState(false);
  // eslint-disable-next-line
  const [ tokenBills, setTokenBills ] = useState({});
  const NotifyUser = useContext(NotifyUserContext);
  

  useLayoutEffect(()=> {
    let obj = {}
    Object.keys(config.Tokens).map((token) => (
      obj = {...obj, [token] : 0}
    ))
    setTokens(obj)
    // eslint-disable-next-line
  },[]);

  const handleKeyPressToken = (e) => {
      const allowedChars = /[0-9]/;
      const charCode = e.charCode;
      const char = String.fromCharCode(charCode);
      if (!allowedChars.test(char)) {
        e.preventDefault();
      }
    };
  
  const handleToken = (e) => {
     setTokens({...tokenBills, [e.target.id]: Number(e.target.value)})
  };

  const handleMotive = (e) => {
      setMotive(e.target.value)
  };
   
  const postTokens = () => {
    Post("/register/v1/manual-adjustment", {
        Tokens: tokens,
        Notes: motive
    }).then(({ data }) => {
        NotifyUser.Success("¡Ajuste manual realizado con éxito!");
        setMotive("");
        let obj = {}
        Object.keys(config.Tokens).map((token) => (
          obj = {...obj, [token] : 0}
        ))
        setTokens(obj);
        setLoadingButton(false);
    })
    .catch((err) => {
      console.log(err)
      NotifyUser.Error(`El registro no fue realizado con éxito. Intente más tarde. Error: ${err.response.status}`)
    })
  };

  const validation = () => {
    if(motive.length >= 25) {
      return true;
    }
  };

  return (
    <Grid container sx={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <Grid container sx={{width:"95%", height:"90%", display:"flex", flexDirection:"column"}}> 
            <Grid item sx={{width:"100%", height:"50%", display:"flex", flexDirection:"column",justifyContent:"center", alignItems: "center"}}>
                <Grid item  
                    sx={{ 
                    height:"90%", 
                    width:"80%", 
                    display:"flex",
                    flexWrap: "wrap", flexDirection:"column", 
                    alignItems: "center",
                    alignContent: "center",justifyContent: 
                    "flex-start", gap:"15px"
                    }}>
                    {Object.keys(config.Tokens).map((token, idx) => (
                        <Paper component="form" key={idx} sx={{padding:"7px"}}>
                            <TextField 
                              autoFocus={idx === 0}
                              id={token}
                              key={idx}
                              onKeyPress={handleKeyPressToken} 
                              label={token}
                              value={tokens[token] === 0 ? "" : tokens[token]}
                              // onFocus={(event) => event.target.select()}
                              onChange={handleToken}
                            />
                        </Paper>
                    ))}
                </Grid>
            </Grid>   
            <Grid item 
                sx={{ 
                width:"100%",
                height:"40%", 
                display:"flex", 
                justifyContent:"center",
                alignItems:"center"
                }}
            >
                <Paper sx={{width: {xl:"30%", xs: "40%"}, padding:"15px"}}> 
                    <TextField 
                        onChange={handleMotive}
                        multiline
                        fullWidth
                        value={motive}
                        label="Motivo"
                        minRows={4}
                        maxRows={6} 
                    />
            </Paper>
        </Grid>
        <Grid item sx={{ width:"100%", height:"10%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {loadingButton ?  
        <LoadingButton
          sx={{ width:{md:"15%", sm:"40%", xs:"50%"}}}
          loading={loadingButton}
          variant="contained"
        >
        </LoadingButton> 
        :  
        <Button 
          variant="contained" 
          onClick={postTokens}
          disabled={!validation()} 
          sx={{ width:{md:"15%", sm:"40%", xs:"50%", height: "75%"}}}>Confirmar</Button>
        }
        </Grid> 
        </Grid>

        
    </Grid>
  );
};


/*  <Grid  item sx={{height:"100%",  display:"flex", flexDirection:"column", 
            justifyContent: "flex-start",alignItems:"center", gap:"15px", flexWrap: "wrap"}}>
              */
export default ManualAdjustment;