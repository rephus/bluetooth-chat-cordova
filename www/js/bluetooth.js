function Bluetooth(bluetooth){

  var TAG = "Bluetooth";
  var CONNECTED= "connected", DISCONNECTED= "disconnected";

  var device = {
      service: 'ffe0',
      characteristic: 'ffe1'
  };

  //Sample peripheral data https://github.com/don/cordova-plugin-ble-central#peripheral-data
  this.isConnected = function(){
    if (device.status === CONNECTED) bluetooth.isConnected(device.peripheral.id, onSuccess, onError);
    else log(TAG, "Device status is not connected");
  }

  this.enable = function() {
    bluetooth.enable(onSuccess, onError);
  }
  this.send = function(msg){
    if (device.status === CONNECTED) {
      log(TAG, "Writing bluetooth: "+msg);
      var bytes = stringToBytes(msg);
      bluetooth.writeWithoutResponse(device.peripheral.id, device.service, device.characteristic, bytes, function(){
        console.log("Write ok");
      }, onError);

      drawMessage("send", msg);

    } else {
      log(TAG, "Cannot send msg, Bluetooth device is not connected", "error");
      drawMessage("error", "Cannot send msg, Bluetooth device is not connected");

    }
  }

  this.scan = function() {
    bluetooth.isEnabled(function(){
      log(TAG, "Scanning devices");

      bluetooth.scan([], 10, onScan, onError);
      setStatus("Scanning devices... ");
      $("#list-devices").empty();
      drawMessage("info", "Scanning devices...");

      setTimeout(function(){setStatus("Finished scan") }
      ,10000);
    }, function(){
      setStatus("Bluetooth is not enabled");
    });

  }

  var setStatus = function(msg) {
    $("#bt-status").html(msg);
  }
  var onScan = function(peripheral) {

      log(TAG, "Scan found: " + JSON.stringify(peripheral));

      var template = $('#device-template').html();
       Mustache.parse(template);
       var rendered = Mustache.render(template, {device: peripheral, title: JSON.stringify(peripheral)});

       var $item = $(rendered);
       //TODO Add all chracterisitics to devices so you can connect to it
       $item.click(function(){
         setStatus("Connecting to "+ peripheral.name + ": " + peripheral.id );
         bluetooth.connect(peripheral.id, onConnect, onDisconnect);
       });
       $("#list-devices").append($item);

  }
  var onConnect = function(peripheral) {

      log(TAG, "onConnect peripheral: " + JSON.stringify(peripheral));
      device.status = CONNECTED;
      setStatus("Connected to " + peripheral.name);
      drawMessage("info", "Connected to " + peripheral.name);

      device.peripheral = peripheral;   //Sample peripheral data https://github.com/don/cordova-plugin-ble-central#peripheral-data

      bluetooth.notify(peripheral.id, device.service, device.characteristic, onData, onError);
  }
  var onDisconnect = function(reason) {
      log(TAG, "onDisconnect reason: " + reason);
      device.status = DISCONNECTED;
      setStatus("Disconnected: " + reason);

      drawMessage("info", "Disconnected: " + reason);
  }
  var onData = function(buffer) {

      var data = bytesToString(buffer);
      log(TAG, "onData data: " + data);

      drawMessage("receive", data);

  }
  var onSuccess = function(response){
      log(TAG, "Successfully executed " + response);
      drawMessage("info", response);

  }
  var onError = function(reason) {
      log(TAG, "There was an error " + reason, "error");
      drawMessage("error", reason);
  }

}
