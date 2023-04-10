import React, { useLayoutEffect, useState, useContext } from "react";
import { ApiContext } from "@oc/api-context";
import NewDeviceRegister from "../components/NewDeviceRegister";
import SingleDetail from "../components/SingleDetail";
import Roulette from "../components/Spinner/Roulette";
import { useParams } from "react-router-dom";
import { Backdrop } from "@mui/material";

const DeviceDetailsLayout = () => {
  const { id, type } = useParams();
  const { Get } = useContext(ApiContext);
  const [onLoading, setOnLoading] = useState(false);
  const [device, setDevice] = useState();
  const [registerNewDevice, setRegisterNewDevice] = useState({});
  const [dispatchGet, setDispatchGet] = useState(false);

  useLayoutEffect(() => {
    if (id) {
      setOnLoading(true);
      Get(`/network-device/v1/by-id/${id}`).then(({ data }) => {
        if (!data["Config"]) {
          setRegisterNewDevice(data);
          setOnLoading(false);
        } else {
          setDevice(data);
          setOnLoading(false);
        }
      });
    }
    // eslint-disable-next-line
  }, [type, dispatchGet]);

  return onLoading ? (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 100 }}
      open={true}
    >
      <Roulette />
    </Backdrop>
  ) : (
    <>
      {device?.Type && <SingleDetail device={device} />}
      {registerNewDevice.Type && (
        <NewDeviceRegister
          setDispatchGet={setDispatchGet}
          device={registerNewDevice}
        />
      )}
    </>
  );
};

export default DeviceDetailsLayout;
