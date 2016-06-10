//Public avaialable cordova functions (loaded on initialization)
var bt;

var app = {
    // Application Constructor
    initialize: function() {
       console.log("Initializing app");
        this.bindEvents();
    },
    bindEvents: function() {
      console.log("Binding events");

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        log("Device ready");

        console.log("Bluetooth plugin " + ble);
        bt = new Bluetooth(ble);
    }
};

app.initialize();
