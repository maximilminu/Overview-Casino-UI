import {
  Box,
  FormControl,
  Paper,
  TextField,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Tokens = ({
  denominations,
  showSupervisionAccordion,
  disabledInputs,
  handleBillBySupervisorChange,
  billsBySupervisor,
  bills,
  handleBillChange,
  usdBills,
  handleUsdBills,
  usdDenomination,
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper
        sx={{
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange}>
                <Tab label="ARS" {...a11yProps(0)} />
                <Tab label="USD" {...a11yProps(1)} />
              </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
              {denominations.map((denom, idx) =>
                showSupervisionAccordion ? (
                  <FormControl key={denom} fullWidth sx={{ marginY: 1 }}>
                    <TextField
                      disabled={!disabledInputs}
                      id={`input-${denom}`}
                      autoFocus={idx === 0}
                      label={`Billetes de $${denom}`}
                      value={billsBySupervisor[denom]}
                      size="small"
                      onChange={(event) => {
                        handleBillBySupervisorChange(denom, event.target.value);
                      }}
                      onFocus={(event) => {
                        event.target.select();
                      }}
                    />
                  </FormControl>
                ) : (
                  <FormControl key={denom} fullWidth sx={{ marginY: 1 }}>
                    <TextField
                      disabled={disabledInputs}
                      id={`input-${denom}`}
                      autoFocus={idx === 0}
                      label={`Billetes de $${denom}`}
                      value={bills[denom]}
                      size="small"
                      onChange={(event) => {
                        handleBillChange(denom, event.target.value);
                      }}
                      onFocus={(event) => {
                        event.target.select();
                      }}
                    />
                  </FormControl>
                )
              )}
            </TabPanel>

            <TabPanel value={value} index={1}>
              {usdDenomination.map((denom, idx) =>
                showSupervisionAccordion ? (
                  <FormControl key={denom} fullWidth sx={{ marginY: 1 }}>
                    <TextField
                      disabled={!disabledInputs}
                      id={`input-${denom}`}
                      autoFocus={idx === 0}
                      label={`Billetes de $${denom}`}
                      value={usdBills[denom]}
                      size="small"
                      onChange={(event) => {
                        handleUsdBills(denom, event.target.value);
                      }}
                      onFocus={(event) => {
                        event.target.select();
                      }}
                    />
                  </FormControl>
                ) : (
                  <FormControl key={denom} fullWidth sx={{ marginY: 1 }}>
                    <TextField
                      disabled={disabledInputs}
                      id={`input-${denom}`}
                      autoFocus={idx === 0}
                      label={`Billetes de $${denom}`}
                      value={usdBills[denom]}
                      size="small"
                      onChange={(event) => {
                        handleUsdBills(denom, event.target.value);
                      }}
                      onFocus={(event) => {
                        event.target.select();
                      }}
                    />
                  </FormControl>
                )
              )}
            </TabPanel>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default Tokens;
