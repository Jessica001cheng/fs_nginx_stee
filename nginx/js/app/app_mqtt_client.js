// Get the hostname, assume mqtt broker and web server are in the same host
var base_url = window.location.host; //Jessica comment for test
//var base_url = "10.8.0.7";
console.log("mqtt url: " + base_url);
var pathArray = base_url.split(':');
var base_host = pathArray[0];

var target_location = {
    hostname: base_host,
    port: 31003
}

client = new Paho.MQTT.Client(target_location.hostname, Number(target_location.port), "web-client");
client.onMessageArrived = onMessageArrived;
var messageVal = '';

var options = {
    timeout: 3,
    onSuccess: onConnect,
};

client.connect(options);

function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("dev_prm_client_msg")
    client.subscribe("dev_dms_client_msg")
    client.subscribe("dev_mcs_target_msg")
    client.subscribe("dev_mdm_client_msg")
    client.subscribe("dev_sim_app_msg")
    client.subscribe("gnss_sim_bls_position_msg")
    client.subscribe("gnss_sim_bfc_door_info_msg")
    client.subscribe("gnss_sim_bfc_mode_info_msg")
    client.subscribe("gnss_sim_bfc_patron_usage_info_msg")
    client.subscribe("gnss_sim_bfc_bus_stop_info_msg")
    client.subscribe("trip_mgr_card_info_msg")
    client.subscribe("trip_mgr_app_msg")
    requestTripInfo();
    requestBusStopInfo();
};

function connect() {
}

function subscribe() {
}

function publish(inJsonObj) {
    var topic = inJsonObj["topic"];

    if( true == g_consoleLog ) {
        console.log("publish() Topic: " + topic);
    }

    message = new Paho.MQTT.Message(JSON.stringify(inJsonObj));
    message.destinationName = topic;
    client.send(message);
}

let gaugeObj = null;
let gaugeSpeedVal = 0;
var gaugeSpeedDef = {
    label: "Bus Speed (km/h)",
    value: gaugeSpeedVal,
    min: 0,
    max: 80,
    decimals: 2,
    gaugeWidthScale: 0.6,
    pointer: true,
    pointerOptions: {
        toplength: 10,
        bottomlength: 10,
        bottomwidth: 2
    },
    counter: true,
    relativeGaugeSize: true
}


function changeStatus(statusName, ledFile) {
    document.getElementById(statusName).src = ledFile;
    // A small function that swaps the LED statuses.
}


function onMessageArrived(message) {
    // Debug - Print arrival of message to console
    if( true == g_consoleLog ) {
        console.log("!!!onMessageArrived: " + message.payloadString);
    }
    console.log("!!!onMessageArrived: " + message.payloadString);
    // Parse obj as json
    var msg = JSON.parse(message.payloadString);

    //var ret = isValidDevice(msg.device_Info.equipment_Id, msg.device_Info.dev_type, msg.device_Info.dev_seq_no);
    var ret = true;
    if (true == ret) {

        if( true == g_consoleLog ) {
            console.log("Valid Device");
        }

        //changeStatus('devvalid', 'images/led-green-black.svg');
        // Limit the number of Rows in the Debug Table
        handleDebugLogTableRowLimits();
        
        if (msg.topic == "gnss_sim_bls_position_msg") {
            handleBlsPositionData(msg);
        }
        else if (msg.topic == "dev_mcs_target_msg") {
            handleMcsTargetData(msg);
        }
        else if (msg.topic == "dev_prm_client_msg") {
            handlePrmClientData(msg);
        }
        else if (msg.topic == "dev_dms_client_msg") {
            handleDmsClientData(msg);
        }
        else if (msg.topic == "dev_mdm_client_msg") {
            handleMdmClientData(msg);
        }
        else if (msg.topic == "dev_sim_app_msg") {

            if(msg.header.notify_msg == "heart_beat") {
                handleAppHeartBeatData(msg);
            }
            else if(msg.header.notify_msg == "param_list_event") {
                handleAppParamListEventData(msg);
            }
        }
        else if (msg.topic == "gnss_sim_bfc_door_info_msg") {
            handleBfcDoorInfoData(msg);
        }
        else if (msg.topic == "gnss_sim_bfc_bus_stop_info_msg") {
            handleBusStopInfoData(msg);
        }
        else if (msg.topic == "gnss_sim_bfc_mode_info_msg") {
            handleModeInfoData(msg);
        }
        else if (msg.topic =="gnss_sim_bfc_patron_usage_info_msg") {
            handlePatronUsageInfoData(msg);
        }
        else if (msg.topic =="trip_mgr_card_info_msg") {
            console.log("handleCardInfoData");
            handleCardInfoData(msg);
        }
        else if (msg.topic =="trip_mgr_app_msg") {
            console.log("handle trip_mgr_app_msg");
            handleTripManagerData(msg);
        }
        console.log("after handle");
    }
    else {
        
        if( true == g_consoleLog ) {
            console.log("Invalid Device");
        }
        
        changeStatus('devvalid', 'images/led-red-black.svg');
    }

}

//GLOBAL VARIABLES
var g_debugRowLimit = 21; //Change the rowlimit as needed.
var g_debugLogRowNewIncrement = 0; 
var g_debugLogRowNum = 0;

function handleDebugLogTableRowLimits() {
    //Finds how many rows there are in transaction debug. Variable ROWNUM is also used in numbering of serial number.
    var currentrow = document.getElementById("transaction-debug").rows.length;
    g_debugLogRowNum = currentrow + g_debugLogRowNewIncrement; //Recursive s/n

    if (currentrow >= g_debugRowLimit) //If theres more than this, remove. Remember that row 0 (the first row) is actually the header!
    {
        document.getElementById("transaction-debug").deleteRow(1);
        g_debugLogRowNewIncrement++; //When currentrow is greater than the number the numbering system will stop working since it removes the first row.
        //So another variable z will be used to count the increments after the threshold.
    }
}

var rotateAngle = 0;
function handleBlsPositionData(msg) {
    // Update the new location to local variables
    g_MapCurLoc.lat = msg.payload.latitude;
    g_MapCurLoc.lng = msg.payload.longitude;

    // Update Google Map
    var myLatLng = new google.maps.LatLng(g_MapCurLoc);
    g_MapMarkerObj.setPosition(myLatLng);
    g_MapObj.setCenter(myLatLng);

    // Update Speed Gauge
    gaugeSpeedVal = msg.payload.speed;
    document.getElementById("mySpeed").innerHTML = gaugeSpeedVal;
    
    if( true == g_consoleLog ) {
        console.log("gnss_sim_bls_position_msg arrived: lat: " + g_MapCurLoc.lat.toString() + ", lng: " + g_MapCurLoc.lng.toString() + ", spd: " + gaugeSpeedVal);
    }
    
    var svgObject = document.getElementById('svg-object').contentDocument;
    var svg = svgObject.getElementById('layer2');
    
    rotateAngle = msg.payload.azimuth;
    let rotateString = 'rotate(' + rotateAngle.toString() + 'deg)';
    svg.setAttribute('transform-origin', '50% 50%');
    svg.style.transform = rotateString;

    var svgText = svgObject.getElementById('text98');
    var textVal = rotateAngle.toFixed(2).toString() + '\u00B0';
    svgText.textContent = textVal;

    // Refresh the speed gauge object 
    if (gaugeObj !== null) {
        gaugeSpeedDef.value = gaugeSpeedVal;
        gaugeObj.refresh(gaugeSpeedVal);
    }
    
    // Update Bus and Trip information
    busID = msg.service_info.service_number;
    tripID = msg.service_info.trip_number;
    dirID = msg.service_info.direction_number;
    document.getElementById("busID").innerHTML = busID;
    document.getElementById("tripID").innerHTML = tripID;
    
    var directionDesc;
    if (dirID == 0) {
        directionDesc = "Outbound";
    }
    else if (dirID == 1) {
        directionDesc = "Inbound";
    }
    document.getElementById("dirID").innerHTML = directionDesc;

    //This appends to the debug log.
    var dbgTable = document.getElementById('transaction-debug');
    var dt = new Date().toLocaleString().replace(',', '');
    dbgTable.insertRow().innerHTML = "<td scope='row'>" + g_debugLogRowNum + "</td>" + "<td>" + dt + "</td>" + "<td>" + "GNSS_POS" + "</td>" + "<td> Lat: "
        + g_MapCurLoc.lat.toString() + ", Lng:" + g_MapCurLoc.lng.toString() + ", Spd: " + gaugeSpeedVal + "</td>";

    if (gaugeSpeedVal == 0) {
        document.getElementById("myStatus").innerHTML = "Stopped";
    }
    else {
        document.getElementById("myStatus").innerHTML = "Moving";
    }
}

function handleMcsTargetData(msg) {
    var dbgTable = document.getElementById('transaction-debug');
    var dt = new Date().toLocaleString().replace(',', '');
    
    var dmtm = "";
    if (msg.header.notify_msg == "notifyDisconnected") {
        dmtm = "Disconnected";
    }
    else if (msg.header.notify_msg == "notifyConnected") {
        dmtm = "Connected";
    }
    else if (msg.header.notify_msg == "notifyGetStatus") {
        dmtm = "GetStatus";
    }
    else if (msg.header.notify_msg == "notifyProcessCommand") {
        dmtm = "ProcessCmd: ";
        dmtm = dmtm + "Cmd_id: " + msg.payload.comd_id.toString();
        dmtm = dmtm + ", Cmd_data: " + msg.payload.comd_data;
        dmtm = dmtm + ", Cmd_rsp: " + msg.payload.comd_response.toString();
    }
    else if (msg.header.notify_msg == "notifyBinaryMsg") {
        dmtm = "BinaryMsg: ";
        dmtm = dmtm + msg.payload.msg;
    }
    else if (msg.header.notify_msg == "notifySentMsg") {
        dmtm = "SentMsg: ";
        dmtm = dmtm + "Msg_id: " + msg.payload.msg_id.toString();
        dmtm = dmtm + "Rsp: " + msg.payload.sent_response.toString();
    }
    else {
        dmtm = msg.payload.msg;
    }

    dbgTable.insertRow().innerHTML = "<td scope='row'>" + g_debugLogRowNum + "</td>" + "<td>" + dt + "</td>" + "<td>" + "MCS_Target" +
        "</td>" + "<td>" + dmtm + "</td>";
}

function handlePrmClientData(msg) {
    
    var dbgTable = document.getElementById('transaction-debug');
    var dt = new Date().toLocaleString().replace(',', '');
    var logflag = false;
    var dmtm = "";

    if (msg.header.notify_msg == "notifyNotificationReceived") {
        dmtm = "Notification Received";
        logflag = true;
    }
    else if (msg.header.notify_msg == "notifyParameterDownloadStarted") {
        dmtm = "Download Started: " + msg.payload.file_id.toString() + ":" + msg.payload.file_name;
        logflag = true;
    }
    else if (msg.header.notify_msg == "notifyParameterDownloaded") {
        dmtm = "Downloaded: " + msg.payload.file_id.toString() + ":" + msg.payload.file_name + ", Ver:" + msg.payload.file_version.toString();
        logflag = true;
    }
    else if (msg.header.notify_msg == "notifyLog") {
        dmtm = "Log: " + msg.payload.msg;
        if(false == dmtm.includes("-----")) {
            logflag = true;
        }
    }

    if( logflag == true)
    {
        dbgTable.insertRow().innerHTML = "<td scope='row'>" + g_debugLogRowNum + "</td>" + "<td>" + dt + "</td>" + "<td>" + "PRM_Client" +
                "</td>" + "<td>" + dmtm + "</td>"
    }
}

function handleDmsClientData(msg) {
    var dbgTable = document.getElementById('transaction-debug');
    var dt = new Date().toLocaleString().replace(',', '');
    var logflag = false;
    var dmtm = "";
    
    if (msg.header.notify_msg == "updateResumeComm") {
        dmtm = "ResumeComm: " + "[SeqNum] " + msg.payload.seq_num.toString();
        logflag = true;
    }
    else if (msg.header.notify_msg == "updateStartComm") {
        dmtm = "StartComm: " + "[SeqNum] " + msg.payload.seq_num.toString();
        logflag = true;
    }
    else if (msg.header.notify_msg == "updateCommReady") {
        dmtm = "CommReady";
        logflag = true;
    }
    else if (msg.header.notify_msg == "updateDisconnect") {
        dmtm = "Disconnected";
        logflag = true;
    }

    if( logflag == true)
    {
        dbgTable.insertRow().innerHTML = "<td scope='row'>" + g_debugLogRowNum + "</td>" + "<td>" + dt + "</td>" + "<td>" + "DMS_Client" +
            "</td>" + "<td>" + dmtm + "</td>";
    }
}

function handleMdmClientData(msg) {
    var dt = new Date().toLocaleString().replace(',', '');
    var dbgTable = document.getElementById('transaction-debug');

    var logflag = false;
    var dmtm = "";

    if (msg.header.notify_msg == "onNoMsgDataToUpload") {
        dmtm = "NoMsgDataToUpload: " + "[LastMsnSent] " + msg.payload.last_msn_sent.toString();
        logflag = true;
    }
    else if (msg.header.notify_msg == "onAllMsgDataUploadSuccessful") {
        dmtm = "AllUploadSuccess: " + msg.payload.msg;
        logflag = true;
    }
    else if (msg.header.notify_msg == "onMsgDataUploadCompleted") {
        dmtm = "UploadCompleted: " + msg.payload.msg;
        logflag = true;
    }
    else if (msg.header.notify_msg == "onMsgDataUploaded") {
        dmtm = "Uploaded: " + msg.payload.msg_data_filename;
        logflag = true;
    }
    else if (msg.header.notify_msg == "onMsgDataFailToUpload") {
        dmtm = "FailToUpload: " + "[ErrCode] " + msg.payload.error_code.toString();
        logflag = true;
    }
    else if (msg.header.notify_msg == "onCreateNewDataFile") {
        dmtm = "CreateNewDataFile: " + "[FileSeqNum] " + msg.payload.file_seq_num.toString();
        logflag = true;
    }
    else if (msg.header.notify_msg == "onMsgDataFailToUpload") {
        dmtm = "FailToUpload: " + "[MsnNotFound] " + msg.payload.msn_not_found.toString();
        logflag = true;
    }
    else if (msg.header.notify_msg == "onMsgDataUploadAborted") {
        dmtm = "UploadAborted: " + "[LastMsnSent] " + msg.payload.last_msn_sent.toString();
        logflag = true;
    }
    else if (msg.header.notify_msg == "onWriteOpDataFail") {
        dmtm = "WriteOpDataFail: " + "[MsnNum] " + msg.payload.msn_num.toString() + "[ErrCode]" + msg.payload.error_code.toString();
        logflag = true;
    }

    if( logflag == true)
    {
        dbgTable.insertRow().innerHTML = "<td scope='row'>" + g_debugLogRowNum + "</td>" + "<td>" + dt + "</td>" + "<td>" + "MDM_Client" +
            "</td>" + "<td>" + dmtm + "</td>";
    }
}

function handleAppHeartBeatData(msg) {
    dms_status = msg.payload.dms_client_comm_ready;
    mcs_status = msg.payload.mcs_target_connected;
    par_status = msg.payload.parameters_activated;
    mqttsub_status = msg.payload.mqtt_client_topic_subscribed;

    var dbgTable = document.getElementById('transaction-debug');
    var dt = new Date().toLocaleString().replace(',', '');

    document.getElementById('heartbeatTime').value = dt;
    
    dbgTable.insertRow().innerHTML = "<td scope='row'>" + g_debugLogRowNum + "</td>" + "<td>" + dt + "</td>" + "<td>" + "DEV_MSG" +
        "</td>" + "<td>DMS: " + dms_status + " MCS: " + mcs_status + " PRM: " + par_status + " MQTT: " + mqttsub_status  + "</td>";

    //sets heartbeat statuses back to red after a set interval.
    if (mqttsub_status == true) {
        changeStatus('mqttsubled', 'images/led-green-black.svg');
        setTimeout(function(){
            changeStatus('mqttsubled', 'images/led-red-black.svg');
        }, 4985)
    }
    else {
        changeStatus('mqttsubled', 'images/led-red-black.svg');
    }

    if (dms_status == true) {
        changeStatus('dmscommled', 'images/led-green-black.svg');
        setTimeout(function(){
            changeStatus('mqttsubled', 'images/led-red-black.svg');
        }, 4990)
    }
    else {
        changeStatus('dmscommled', 'images/led-red-black.svg');
    }

    if (mcs_status == true) {
        changeStatus('mcsconnled', 'images/led-green-black.svg');
        setTimeout(function(){
            changeStatus('mqttsubled', 'images/led-red-black.svg');
        }, 4990)
    }
    else {
        changeStatus('mcsconnled', 'images/led-red-black.svg');
    }

    if (par_status == true) {
        changeStatus('prmactled', 'images/led-green-black.svg');
        setTimeout(function(){
            changeStatus('mqttsubled', 'images/led-red-black.svg');
        }, 4990)
    }
    else {
        changeStatus('prmactled', 'images/led-red-black.svg');
    }
}

function handleAppParamListEventData(msg) {
    var paramTable = document.getElementById('parameter-table');
    
    // Remove all existing rows in the table
    for(var i = paramTable.rows.length - 1; i > 0; i--) {
        paramTable.deleteRow(i);
    }

    var rowCount = 1;
    paramList = msg.payload.param_list;
    paramList.forEach((paramInfo) => {
        paramTable.insertRow().innerHTML = "<td scope='row'>" + rowCount + "</td>" + 
                                           "<td>" + paramInfo.active_indicator + "</td>" + 
                                           "<td>" + paramInfo.file_id + "</td>" + 
                                           "<td>" + paramInfo.file_name + "</td>" + 
                                           "<td>" + paramInfo.file_version + "</td>";
        rowCount++;
    });
}

function handleBfcDoorInfoData(msg) {
    var doordesc;
    doorstatus = msg.payload.door_status;
    switch(doorstatus){
        case 0:
            doordesc = "All doors closed.";
            break;
        case 1:
            doordesc = "Front door open.";
            break;
        case 2:
            doordesc = "Rear door open.";
            break;
        case 3:
            doordesc = "All doors open.";
            break;
    }
    document.getElementById("doorStatus").innerHTML = doordesc;
    var dbgTable = document.getElementById('transaction-debug');
    var dt = new Date().toLocaleString().replace(',', '');
    dbgTable.insertRow().innerHTML = "<td scope='row'>" + g_debugLogRowNum + "</td>" + "<td>" + dt + "</td>" + "<td>" + "GNSS_Door" +
        "</td>" + "<td>" + doordesc + "</td>";
}

function handleBusStopInfoData(msg) {
    busstop = msg.payload.bus_stop;
    bussdesc = msg.payload.bus_stop_description;
    document.getElementById("stopID").innerHTML = busstop;
    document.getElementById("stopInfo").innerHTML = bussdesc;
    var dt = new Date().toLocaleString().replace(',', '');
    var dbgTable = document.getElementById('transaction-debug');
    dbgTable.insertRow().innerHTML = "<td scope='row'>" + g_debugLogRowNum + "</td>" + "<td>" + dt + "</td>" + "<td>" + "GNSS_BusInfo" +
        "</td>" + "<td> Approaching stop " + busstop + " " + bussdesc + "</td>";
}

function handleModeInfoData(msg) {
    var bfcdesc;
    bfcmode = msg.payload.bfc_mode;
    switch(bfcmode){
        case 0:
            bfcdesc = "Off Shift.";
            break;
        case 1:
            bfcdesc = "On Shift, Off-Trip.";
            break;
        case 2:
            bfcdesc = "On Shift, On-Trip.";
            break;
        case 3:
            bfcdesc = "On Shift, Locked.";
            break;
    }
    document.getElementById("shiftID") = bfcdesc;
    var dt = new Date().toLocaleString().replace(',', '');
    var dbgTable = document.getElementById('transaction-debug');
    dbgTable.insertRow().innerHTML = "<td scope='row'>" + g_debugLogRowNum + "</td>" + "<td>" + dt + "</td>" + "<td>" + "GNSS_BFCMode" +
        "</td>" + "<td> BFC Mode " + bfcmode + " " + bfcdesc + "</td>";
}

function handlePatronUsageInfoData(msg) {
    boardCash = msg.payload.cash_boarding;
    document.getElementById("cashBoard").innerHTML = boardCash;

    boardConcession = msg.payload.concession_boarding;
    document.getElementById("concessionBoard").innerHTML = boardConcession;

    alightConcession = msg.payload.concession_alighting;
    document.getElementById("concessionAlight").innerHTML = alightConcession;
    
    boardCepas = msg.payload.cepas_boarding;
    document.getElementById("cepasBoard").innerHTML = boardCepas;

    alightCepas = msg.payload.cepas_alighting;
    document.getElementById("cepasAlight").innerHTML = alightCepas;

    var dbgTable = document.getElementById('transaction-debug');
    var dt = new Date().toLocaleString().replace(',', '');
    dbgTable.insertRow().innerHTML = "<td scope='row'>" + g_debugLogRowNum + "</td>" + "<td>" + dt + "</td>" + "<td>" + "GNSS_Usage" +
        "</td>" + "<td> Cash: " + boardCash + " Concession B: " + boardConcession + " A: " + alightConcession + " Cepas B: " 
        + boardCepas + " A: " + alightCepas + " </td>";
}

function handleCardInfoData(msg) {
    cardtype = msg.card_info.card_type;
    console.log(cardtype);
    document.getElementById("cardtype").value = cardtype;

    cardnumber = msg.card_info.card_number;
    document.getElementById("cardnumber").value = cardnumber;

    bcvname = msg.device_Info.equipment_Id;
    document.getElementById("bcvname").value = bcvname;

    document.getElementById('carddisplay').style.visibility='visible';

    if(cardtype == "CEPAS")
        document.getElementById("carddisplay").src = "/images/Cepas_New_Ride.png";
    else if(cardtype == "BANKCARD")
        document.getElementById("carddisplay").src = "/images/Bankcard_usage.png";
    else if(cardtype == "CEPAS TOKEN")
        document.getElementById("carddisplay").src = "/images/CTC_usage.png";
    else
        document.getElementById('carddisplay').style.visibility='hidden';
    setTimeout(function() {
        console.log("timeout");
        document.getElementById("cardtype").value = "";
        document.getElementById("bcvname").value = "";
        document.getElementById("cardnumber").value = "";
        document.getElementById('carddisplay').style.visibility='hidden';
     }, 3000);
}


function handleTripManagerData(msg) {
    msg_id = msg.payload.msg_id;
    console.log( msg_id );
    if(msg_id === websocket_app_msg_id_list.NO_RPLY)
    {
        var dateObj= new Date();
        var dt = dateObj.toLocaleString('en-US', { hour12: false }).replace(',', '');
        var millisec = dateObj.getMilliseconds();
        document.getElementById("receiveprofileTime").innerHTML = dt+":"+millisec;
        document.getElementById('requestreply').disabled = false;
    }
    else if(msg_id === websocket_app_msg_id_list.REQUEST_TRIP_INFO)
    {
        document.getElementById("service number").innerHTML =  msg.payload.service_number;
        document.getElementById("bus plate").innerHTML =  msg.payload.bus_plate;
        document.getElementById("spid").innerHTML =  msg.payload.spid;
        document.getElementById("direction").innerHTML =  msg.payload.direction;
    }
    else if(msg_id === websocket_app_msg_id_list.REQUEST_BUSSTOP_INFO)
    { 
        document.getElementById("distance travalled").innerHTML =  msg.payload.current_stop_info.distanceTravelled;

        document.getElementById("current stop ID").innerHTML =  msg.payload.current_stop_info.busStopID;
        document.getElementById("current stop name").innerHTML =  msg.payload.current_stop_info.busStopName;
        //document.getElementById("current stop expected time").innerHTML =  msg.payload.current_stop_info.busStopID;

        document.getElementById("next stop ID").innerHTML =  msg.payload.next_stop_info.busStopID;
        document.getElementById("next stop name").innerHTML =  msg.payload.next_stop_info.busStopName;
        //document.getElementById("next stop expected time").innerHTML =  msg.payload.current_stop_info.busStopID;

        document.getElementById("next next stop ID").innerHTML =  msg.payload.next_next_stop_info.busStopID;
        document.getElementById("next next stop name").innerHTML =  msg.payload.next_next_stop_info.busStopName;
        //document.getElementById("next next stop expected time").innerHTML =  msg.payload.current_stop_info.busStopID;

        document.getElementById("destination stop ID").innerHTML =  msg.payload.destination_stop_info.busStopID;
        document.getElementById("destination stop name").innerHTML =  msg.payload.destination_stop_info.busStopName;
        //document.getElementById("destination stop expected time").innerHTML =  msg.payload.current_stop_info.busStopID;
    }
    else
    {
        console.log("unknown message received");
    }
}
