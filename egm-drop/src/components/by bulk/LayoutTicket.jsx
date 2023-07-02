import { Grid, InputBase, styled, TextField } from '@mui/material'
import { ConfigContext } from '@oc/config-context'
import React from 'react'
import { useContext } from 'react'
import Barcode from "react-barcode";
const LayoutTicket = () => {
  // eslint-disable-next-line 
    const config = useContext(ConfigContext)

// eslint-disable-next-line 
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    // backgroundColor: theme.palette.mode === 'light' ? '#F3F6F9' : '#1A2027',
    border: '1px solid',
    // borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
    fontSize: 16,
    width: 'auto',
    padding: '2px 7px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
  },
}));

const style = {
  sb : {
    "& .MuiInputBase-root":{
      marginTop:"10px",
      fontSize:"13px",
      fontWeight: 550
    },
  },
  h3: {
    "& .MuiInputBase-root":{
      marginTop:"10px",
      fontSize:"20px",
      fontWeight: 600,
      
    }
  },
  h1:{
    "& .MuiInputBase-root": {
      marginTop:"10px",
      fontSize:"20px",
      fontWeight: 700,
    }
   
  }
}

  return (
    <>
    <Grid container sx={{width:"100%", height:"100%",display:"flex", alignItems:"center"}}>
      <Grid container  sx={{width:"100%", height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems: "center", gap:"2px" }}>
        <TextField sx={style.h3} variant="standard" size="x-small" label="Título Terciario"/>
        <Grid item sx={{display:"flex", justifyContent:"space-evenly",  alignItems:"center", width:"100%"}}>
        <TextField sx={style.sb} variant="standard" size="x-small" label="Subtítulo1"/>
        <TextField sx={style.sb} variant="standard" size="x-small" label="Subtítulo2"/>
        </Grid> 
          <TextField sx={style.h1} variant="standard" size="small" label="Texto Principal"/>
            <Barcode
              height={10}
              width={1}
              value="999"
            />
            <Grid item sx={{display:"flex", gap:"5px"}}>
            <TextField sx={style.sb} variant="standard" size="small" label="Título"/>
            <TextField variant="filled" size="small" label="Título"/>
            </Grid>
            <Grid item  sx={{display:"flex", gap:"5px"}}>
            <TextField variant="filled" size="small" label="Título"/>
            <TextField variant="filled" size="small" label="Título"/>
            <TextField variant="filled" size="small" label="Título"/>
            </Grid>
            <TextField variant="filled" size="small" label="Título"/>
            <TextField variant="filled" size="small" label="Título"/>
            <TextField variant="filled" size="small" label="Título"/>
            <Grid item sx={{display:"flex", gap:"5px"}}>
            <TextField variant="filled" size="small" label="Título"/>
            <TextField variant="filled" size="small" label="Título"/>
            </Grid>
      </Grid>
      {/* <Grid container sx={{backgroundColor:"yellow",width:"5%",transform: 'rotate(-90deg)'  }}>
      <h1>hola</h1>
    </Grid> */}
    </Grid>

    </>
  )
}

export default LayoutTicket

/*  <Grid item sx={{display:"flex", alignItems:"center", width:"100%", backgroundColor:"blue"}}>
            <Typography>{config.BatchTicketInformation.SH1}</Typography>
            <Typography>{config.BatchTicketInformation.SH2}</Typography>
        </Grid> */