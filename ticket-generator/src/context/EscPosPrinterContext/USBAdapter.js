export default class USBAdapter {
  device;

  constructor(device) {
    this.device = device;
  }
  open(callback) {
    this.device
      .open()
      .then(() => this.device.selectConfiguration(1))
      .then(() => this.device.claimInterface(0))
      .then(() => callback(null))
      .catch((e) => callback(e));
  }
  read(callback) {
    // console.log("READ");
  }
  write(data, callback) {
    const arrDevices = this.device.configurations[0].interfaces[0].alternates[0].endpoints;
    const optionForEmpoint = arrDevices.filter(e=> e.direction === "out")
    this.device.transferOut(optionForEmpoint[0].endpointNumber || 1, data);
  }
  close(callback, timeout) {
    // console.log("CLOSE");
    if (this.device.close()) {
      callback(null);
    } else {
      callback(true);
    }
  }
}
