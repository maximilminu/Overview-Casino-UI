import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PcDevicesList from "../components/Lists/PcDevicesList";
import EGMDesvicesList from "../components/Lists/EGMDesvicesList";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutlet,
  useParams,
} from "react-router-dom";
import { useLayoutEffect } from "react";
import { NotifyUserContext } from "@oc/notify-user-context";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import { ApiContext } from "@oc/api-context";
import { Backdrop, Tooltip } from "@mui/material";
import Roulette from "../components/Spinner/Roulette";
import PrivateKiosksDevicesList from "../components/Lists/PrivateKiosksDevicesList";
import PublicKiosksDevicesList from "../components/Lists/PublicKiosksDevicesList";
import VerificationCodeDialog from "../components/VerificationCodeDialog";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: "90%" }}
    >
      {value === index && (
        <Box sx={{ height: "100%" }} p={2}>
          <Typography sx={{ height: "100%" }}>{children}</Typography>
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

const AllDeviceList = () => {
  const { Get } = useContext(ApiContext);
  const ifOutlet = useOutlet();
  const navigate = useNavigate();
  const { type } = useParams();
  const [value, setValue] = useState(0);
  const [egmDevices, setEgmDevices] = useState([]);
  const [pcDevices, setPcDevices] = useState([]);
  const [onLoading, setOnLoading] = useState(false);
  const [publicKiosksDevices, setPublicKiosksDevices] = useState([]);
  const [privateKiosksDevices, setPrivateKiosksDevices] = useState([]);
  const NotifyUser = useContext(NotifyUserContext);
  const [devicesTypes, setDevicesTypes] = useState({});
  const url = useLocation().pathname;
  useLayoutEffect(() => {
    setValue(parseInt(type));
  }, [type]);

  const handleClick = (type) => {
    if (type === 0) {
      navigate(`/network-devices/list/${type}/add-new-device`);
    } else {
      navigate(`/network-devices/list/${type}`);
    }
  };

  useLayoutEffect(() => {
    setOnLoading(true);
    Get("/network-device/v1/types")
      .then(({ data }) => {
        setDevicesTypes(data);
      })

      .then(() => {
        Get("/network-device/v1/all")
          .then(({ data }) => {
            setEgmDevices(data.filter((x) => x.Type === 1 && x.Config));
            setPublicKiosksDevices(
              data.filter((x) => x.Type === 2 && x.Config)
            );
            setPrivateKiosksDevices(
              data.filter((x) => x.Type === 3 && x.Config)
            );
            setPcDevices(data.filter((x) => x.Type === 4 && x.Config));
            setOnLoading(false);
          })
          .catch((err) => {
            setOnLoading(false);
            NotifyUser.Warning(
              "Error para mostrar los dispositivos, intente nuevamente."
            );
          });
      });

    // eslint-disable-next-line
  }, [url]);

  const devicesList = (type) => {
    switch (type) {
      case "0":
        return (
          <TabPanel value={value} index={0}>
            <VerificationCodeDialog />
          </TabPanel>
        );
      case "1":
        return (
          <TabPanel value={value} index={1}>
            <EGMDesvicesList egms={egmDevices} />
          </TabPanel>
        );
      case "2":
        return (
          <TabPanel value={value} index={2}>
            <PublicKiosksDevicesList
              publicKiosksDevices={publicKiosksDevices}
            />
          </TabPanel>
        );
      case "3":
        return (
          <TabPanel value={value} index={3}>
            <PrivateKiosksDevicesList
              privateKiosksDevices={privateKiosksDevices}
            />
          </TabPanel>
        );
      case "4":
        return (
          <TabPanel value={value} index={4}>
            <PcDevicesList pcs={pcDevices} />
          </TabPanel>
        );
      default:
        console.log("No hay datos");
    }
  };

  return onLoading ? (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 100 }}
      open={true}
    >
      <Roulette />
    </Backdrop>
  ) : ifOutlet ? (
    <Outlet />
  ) : (
    <Box sx={{ width: "100%", marginTop: "5px", height: "100%" }}>
      <Tabs
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        aria-label="nav tabs example"
      >
        {devicesTypes &&
          Object.keys(devicesTypes).map((key,index) => {
            return key !== "0" ? (
              <Tab
                sx={{
                  "&.MuiButtonBase": {
                    color: "secondary.main",
                  },
                  color: "secondary.main",
                }}
                onClick={() => {
                  handleClick(key);
                }}
                key={index}
                label={devicesTypes[key]}
                {...a11yProps(key)}
              />
            ) : (
              <Tooltip title="Nuevo dispositivo"
                key={index}
              >
                <Tab
                  onClick={() => {
                    handleClick(key);
                  }}
                  {...a11yProps(key)}
                  sx={{
                    position: "absolute",
                    right: 0,
                  }}
                  icon={<AddToQueueIcon />}
                  aria-label="person"
                />
              </Tooltip>
            );
          })}
      </Tabs>
      {devicesList(type)}
    </Box>
  );
};

/*  <Tab
                  onClick={() => {
                    handleClick(key);
                  }}
                  key={devicesTypes[key]}
                  label={devicesTypes[key]}
                  {...a11yProps(key)}
                />

/* <Tooltip title="Nuevo dispositivo">
                <Tab
                  onClick={() => {
                    handleClick(key);
                  }}
                  {...a11yProps(key)}
                  sx={{
                    position: "absolute",
                    right: 0,
                  }}
                  icon={<AddToQueueIcon />}
                  aria-label="person"
                />
              </Tooltip> */

export default AllDeviceList;
