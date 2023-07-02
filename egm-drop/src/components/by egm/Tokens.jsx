import { FormControl, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React, { useLayoutEffect } from 'react'



  const translate = (format, sign, value) => {
    switch (format) {
    case "Bill":
        return `Billetes ${sign}${value}`;
    case "Coin":
        return `Monedas ${sign}${value}`;
    default:
        return `${sign}${value}`;
    }
  };


const Tokens = (props) => {
  

  useLayoutEffect(() => {
    document.addEventListener("keydown", function (event) {
      if (event.keyCode === 13 && event.target.nodeName === "INPUT") {
        var form = event.target.form;
        var index = Array.prototype.indexOf.call(form, event.target);
        form.elements[index + 2]?.focus();
        event.preventDefault();
      }
    });
  }, []);

      


  return (
    <>
      {props && props.token && 
        <Grid item sx={props.sx || { display:"flex", flexDirection:"row", width: "100%", height: "100%", gap: "10px", justifyContent: "space-evenly" }}>
          {Object.keys(props.token).map((tokenKey, index) => (
            <TableContainer   
              component={Paper}
              key={tokenKey}
              sx={{
              
                overflow: "auto",
                maxHeight: "95%",
              }}
            >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{textAlign:"center", padding:"10px", fontWeight: 550}}>
                        {props.token[tokenKey].Desc} ({tokenKey})
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{  borderBottom:"none"}}>
                        <form id={index}>
                          <FormControl sx={{ marginY: 0.5 }} fullWidth>
                            {props.token[tokenKey].Values
                            .sort((a,b) => b.Value - a.Value)
                            .sort((a,b) => a.Format.localeCompare(b.Format))
                            .map((token, idx) => (
                            Object.keys(props.denominations).length >=1 && 
                              <TextField
                              key={idx}
                              onKeyPress={props.handleKeyPressToken}
                              sx={{ marginY: 0.5 }}
                              disabled={ !token.Cashier }
                              id={`input-${token.Value}`}
                              autoFocus={idx === 0 && index === 0}
                              label={props.label || translate(token.Format, props.token[tokenKey].Sign, token.Value)}
                              onChange={(e) => props.onChange(e, tokenKey, token)}
                              value={props.denominations && isNaN(props.denominations[tokenKey][`${token.Format}:${token.Value}`]) ? 0 : props.denominations[tokenKey][`${token.Format}:${token.Value}`]}
                              size="small"
                              onFocus={(event) => event.target.select()}
                            /> 
                          ))}
                          </FormControl>
                        </form>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ))
          }
        </Grid>
      }
    </>
  )
}

export default Tokens


/*  <Typography variant="body2">{tokenKey}</Typography>
                  <Divider />
                  <form id={index}>
                    <FormControl sx={{ marginY: 0.5 }} fullWidth>
                      {props.token[tokenKey].Values
                      .sort((a,b) => b.Value - a.Value)
                      .sort((a,b) => a.Format.localeCompare(b.Format))
                      .map((token, idx) => (
                       Object.keys(props.denominations).length >=1 && 
                        <TextField
                        key={idx}
                        onKeyPress={props.handleKeyPressToken}
                        sx={{ marginY: 0.5 }}
                        disabled={ !token.Cashier }
                        id={`input-${token.Value}`}
                        autoFocus={idx === 0 && index === 0}
                        label={props.label || translate(token.Format, props.token[tokenKey].Sign, token.Value)}
                        onChange={(e) => props.onChange(e, tokenKey, token)}
                         value={props.denominations && props.denominations[tokenKey][`${token.Format}:${token.Value}`]}
                        size="small"
                        onFocus={(event) => event.target.select()}
                      /> 
                      ))}
                    </FormControl>
                </form> */ 