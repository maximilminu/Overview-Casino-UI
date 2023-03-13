export default class SerialAdapter {
  port;

  constructor(port) {
    this.port = port;
  }
  open(callback) {
    this.port.open({ baudRate: 9600, flowControl: 'hardware' }).then(() => {
        callback();
    }).catch(() => {
      callback(true);
    })
  }

  read(callback) {
    console.log('READ');
  }
  write(data, callback) {
    const writer = this.port.writable.getWriter();
    console.log('Wrinting', data);
    writer.write(data).then(() => {
      writer.releaseLock();
      callback();
    }).catch(() => {
      callback(true);
    })
    
  }
  close(callback, timeout) {
    console.log('CLOSE');
    if (this.port.close()) {
      callback(null);
    } else {
      callback(true);
    }
  }
}