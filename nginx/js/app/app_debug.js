//A function to hide some elements in the main screen
function hideDebug() {
    var x = document.getElementById("panelDebug");
    var y = document.getElementById("debugCheck");
    if (y.checked == true) {
        x.style.display = "block";
    }
    else {
        x.style.display = "none";
    }
}

let g_consoleLog = false;
function consoleLog() {
    var y = document.getElementById("consoleLog");
    if (y.checked == true) {
        g_consoleLog = true;
    }
    else {
        g_consoleLog = false;
    }
}

function confirmclearDebug(){
    if (confirm("Warning: This will clear all logs, including the console."))
    {
        clearDebug();
    }
    else{}

}

function clearDebug() {
    var trtheaderrow = 1;
    var trt = document.getElementById('transaction-table');
    var trtrowCount = trt.rows.length;
    for (var i = trtheaderrow; i < trtrowCount; i++) {
        trt.deleteRow(trtheaderrow);
    }
    rowts = 1;

    var trdheaderrow = 1;
    var trd = document.getElementById('transaction-debug');
    var trdrowCount = trd.rows.length;
    for (var i = trdheaderrow; i < trdrowCount; i++) {
        trd.deleteRow(trdheaderrow);
    }
    
    rownum = 1;
    z = 0;
    console.clear();
    
}

function setDefault() {
    
    // Get the existing gate selection - To support refresh
   // var dropDown = document.getElementById("gate-select");
    //var strGate = dropDown.value;
    deviceSelect("G01");
    
    //Sets some stuff to some defaults to improve user experience. Triggered onload.
    var curDate= new Date();
    date = curDate.toLocaleDateString().replace(',', '');
    time = curDate.toLocaleTimeString('it-IT');
    console.log("setDefault: " + date + time);
    document.getElementById("currentdate").innerText = date;
    document.getElementById("currenttime").innerText = time;
    document.getElementById("service number").innerText = "85";
    document.getElementById("bus plate").innerText = "SBS3008";
    document.getElementById("spid").innerText = "16:SBST";

    document.getElementById("direction").innerHTML = "1";
    document.getElementById("distance travalled").innerHTML = "0";

}

//sets the epoch time on the UI.
function updateClock(){
    setInterval(myinterval, 1000);
}
function myinterval(){
    var curDate= new Date();
    date = curDate.toLocaleDateString().replace(',', '');
    time = curDate.toLocaleTimeString('it-IT');
    //console.log("!!!intervalTimer: " + date + time);
    document.getElementById('currentdate').innerHTML = date;
    document.getElementById('currenttime').innerHTML = time;
  }

window.onload = function(){
    setDefault();
    updateClock();
}
