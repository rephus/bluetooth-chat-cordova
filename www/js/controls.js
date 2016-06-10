$("#custom-message-button").click(function(){
    var customMessage = $("#custom-message").val();
    log("Controls", "Sending custom message: "+ customMessage);
    bt.send(customMessage);
});

$("#bt-connect").click(function(){

  bt.connect();
});
$("#bt-scan").click(function(){

  bt.scan();
});

$("#clear-chat").click(function(){
  $("#chat").empty();
});
