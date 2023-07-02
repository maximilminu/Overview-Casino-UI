import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import InteractionDevicesIcon from "../InteractionDevicesIcon";
import { useNavigate } from "react-router-dom";
import DescribeText from "../DescribeText";
const style = {
  tableCell: {
    fontWeight: "700",
    color: "rgb(123, 128, 154)",
    textTransform: "uppercase",
    textAlign: "center",
    backgroundColor: "#ffffff",
  },
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    height: "50px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme,backgroundColorr }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor:backgroundColorr || theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const PrivateKiosksDevicesList = ({ privateKiosksDevices }) => {
  const navigate = useNavigate();

  const handleClick = (device) => {
    navigate(`setup/${device.ID}`);
  };

  return (
    privateKiosksDevices && (
      <TableContainer
        component={Paper}
        id="chau"
        sx={{
          overflow: "auto",
          maxHeight: "100%",
          // maxHeight: { xl: 700, lg: 500, md: 400 },
        }}
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          size="small"
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell sx={style.tableCell}>Nombre</StyledTableCell>
              <StyledTableCell sx={style.tableCell}>
                Descripción
              </StyledTableCell>
              <StyledTableCell sx={style.tableCell}>Area</StyledTableCell>
              <StyledTableCell sx={style.tableCell}>IP</StyledTableCell>
              <StyledTableCell sx={style.tableCell}>Perfil</StyledTableCell>
              <StyledTableCell sx={style.tableCell}>Periféricos</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          
            {privateKiosksDevices &&
              privateKiosksDevices.map((device, index) =>(
                device.Config && (
                <StyledTableRow
                  backgroundColorr={device.Config.ConfigMode ? "primary.main" : false}
                  sx={{
                    backgroundColor: device.Config.ConfigMode ? "primary.main" : null,
                    "&:last-child td, &:last-child th": { border: 0 },
                    " &:hover": {backgroundColor: "#e5e5e5"},
                    cursor: "pointer",
                    transition: "all .2s ease-in",
                  }}
                  onClick={() => {handleClick(device)}}
                  key={index}
                  >
                  <TableCell align="center">{device.Config.Name}</TableCell>
                  <TableCell align="center">
                    {device["Properties"]["Brand"]}{" "}
                    {device["Properties"]["Model"]}
                  </TableCell>
                  




                  <TableCell align="center">
                    <DescribeText
                          otherPath={`/network-device/v1/describe-area/${device.Config.AreaID}`}
                          style={{padding:"6px 16px"}}
                        />
                  </TableCell>




                  <TableRow align="center">
                    {[Object.keys(device.Properties["NICs"])[0]].map((key,index) => (
                      <TableCell key={index}>
                        {Object.keys(device["Properties"]["NICs"][key]).map(
                          (subKey,index) => (
                            <Typography sx={{ fontSize: "15px" }} key={index}>
                              {subKey}:
                              {device["Properties"]["NICs"][key][subKey]}
                            </Typography>
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableCell align="center">
                    
                  <TableCell align="center">
                    <DescribeText
                          otherPath={`/network-device/v1/describe-profile/${device.Config.ProfileID}`}
                         
                        />
                  </TableCell>



                  </TableCell>
                  <TableCell align="center">
                    {device["Config"]["Peripherals"]
                      ? Object.keys(device.Config["Peripherals"]).map((key,index) => (
                        
                            //  <Tooltip
                            //    sx={{pointer:"none"}}
                            //    key={index}
                            //    title={device["Config"]["Peripherals"][key]}
                            //  >
                               <i style={{pointer:"none"}}>
                                 <InteractionDevicesIcon
                                   media={key}
                                   width={24}
                                   height={24}
                                 />
                               </i>
                            //  </Tooltip>
                      )
                        )
                      : null}
                  </TableCell>
                </StyledTableRow>
                )
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
};

export default PrivateKiosksDevicesList;
