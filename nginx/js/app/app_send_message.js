const websocket_app_msg_id_list = {
                                        NO_RPLY: "NO_PAYLOAD_REPLY",
                                        REQUEST_TRIP_INFO: "REQUEST_TRIP_INFO",
                                        REQUEST_BUSSTOP_INFO: "REQUEST_BUSSTOP_INFO"
                                    }

function seconds_since_epoch(d) { 
    return Math.floor( d / 1000 ); 
}

function requesttripmgrreply() {
    var dateObj= new Date();
    var dt = dateObj.toLocaleString('en-US', { hour12: false }).replace(',', '');
    var millisec = dateObj.getMilliseconds();
    document.getElementById("startprofileTime").innerHTML = dt+":"+millisec;

    document.getElementById('requestreply').disabled = true;

    var txn = genMsgObj(websocket_app_msg_id_list.NO_RPLY);
    console.log(txn);
    if(txn != null){
        let jsonMsg = JSON.stringify(txn);
        console.log(jsonMsg);

        publish(txn);
    }

}

function requestTripInfo() {
    var txn = genMsgObj(websocket_app_msg_id_list.REQUEST_TRIP_INFO);
    console.log(txn);
    if(txn != null){
        let jsonMsg = JSON.stringify(txn);
        console.log(jsonMsg);

        publish(txn);
    }

}

function requestBusStopInfo() {
    var txn = genMsgObj(websocket_app_msg_id_list.REQUEST_BUSSTOP_INFO);
    console.log(txn);
    if(txn != null){
        let jsonMsg = JSON.stringify(txn);
        console.log(jsonMsg);

        publish(txn);
    }

}


function genMsgObj(msg_id) {
    var d = Date.now();
    var sec = seconds_since_epoch(d);

    var message =  {
        "topic":"websocket_app_msg",
        "header": {
            "version":1,
            "unix_epoch_sec":sec,
        },
        "device_Info": {
            "equipment_Id": "test",
            "station_id":"test",
            "dev_type":"ITFS",
            "dev_seq_no":2231
        },
        "payload": {
            "msg_id": msg_id
        }
    }

    return message;
}
