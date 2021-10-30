rowts = 1;

function seconds_since_epoch(d) { 
    return Math.floor( d / 1000 ); 
}

function genCepasEntry() {
    var txn = genTxnObj(0x3200);
    if(txn != null){
        let jsonMsg = JSON.stringify(txn);
        console.log(jsonMsg);

        publish(txn);
    }
    var tsTable = document.getElementById('transaction-table');
        var dt = new Date().toLocaleString().replace(',', '');
        tsTable.insertRow().innerHTML = "<td scope='row'>" + rowts + "</td>" + "<td>" + dt + "</td>" + "<td>" + "CEPAS entry generated." + "</td>";
        rowts++;
}

function genCepasExit() {
    var txn = genTxnObj(0x1100);
    if(txn != null){
        let jsonMsg = JSON.stringify(txn);
        console.log(jsonMsg);

        publish(txn);
    }
    var tsTable = document.getElementById('transaction-table');
        var dt = new Date().toLocaleString().replace(',', '');
        tsTable.insertRow().innerHTML = "<td scope='row'>" + rowts + "</td>" + "<td>" + dt + "</td>" + "<td>" + "CEPAS exit generated." + "</td>";
        rowts++;
}

function genCepasPassEntry() {
    var txn = genTxnObj(0x3305);
    if(txn != null){
        let jsonMsg = JSON.stringify(txn);
        console.log(jsonMsg);

        publish(txn);
    }
    var tsTable = document.getElementById('transaction-table');
        var dt = new Date().toLocaleString().replace(',', '');
        tsTable.insertRow().innerHTML = "<td scope='row'>" + rowts + "</td>" + "<td>" + dt + "</td>" + "<td>" + "CEPAS PASS entry generated." + "</td>";
        rowts++;
}

function genCepasPassExit() {
    var txn = genTxnObj(0x3202);
    if(txn != null){
        let jsonMsg = JSON.stringify(txn);
        console.log(jsonMsg);

        publish(txn);
    }
    var tsTable = document.getElementById('transaction-table');
        var dt = new Date().toLocaleString().replace(',', '');
        tsTable.insertRow().innerHTML = "<td scope='row'>" + rowts + "</td>" + "<td>" + dt + "</td>" + "<td>" + "CEPAS PASS exit generated." + "</td>";
        rowts++;
}

function genCepasTokenEntry() {
    var txn = genTxnObj(0xF000);
    if(txn != null){
        let jsonMsg = JSON.stringify(txn);
        console.log(jsonMsg);

        publish(txn);
    }
    var tsTable = document.getElementById('transaction-table');
        var dt = new Date().toLocaleString().replace(',', '');
        tsTable.insertRow().innerHTML = "<td scope='row'>" + rowts + "</td>" + "<td>" + dt + "</td>" + "<td>" + "CEPAS TOKEN entry generated." + "</td>";
        rowts++;
}

function genCepasTokenExit() {
    var txn = genTxnObj(0xF001);
    if(txn != null){
        let jsonMsg = JSON.stringify(txn);
        console.log(jsonMsg);

        publish(txn);
    }
    var tsTable = document.getElementById('transaction-table');
        var dt = new Date().toLocaleString().replace(',', '');
        tsTable.insertRow().innerHTML = "<td scope='row'>" + rowts + "</td>" + "<td>" + dt + "</td>" + "<td>" + "CEPAS TOKEN exit generated." + "</td>";
        rowts++;
}

function genBankcardEntry() {
    var txn = genTxnObj(0xD000);
    if(txn != null){
        let jsonMsg = JSON.stringify(txn);
        console.log(jsonMsg);

        publish(txn);
    }
    var tsTable = document.getElementById('transaction-table');
        var dt = new Date().toLocaleString().replace(',', '');
        tsTable.insertRow().innerHTML = "<td scope='row'>" + rowts + "</td>" + "<td>" + dt + "</td>" + "<td>" + "Bank card entry generated." + "</td>";
        rowts++;
}

function genBankcardExit() {
    var txn = genTxnObj(0xD001);
    if(txn != null){
        let jsonMsg = JSON.stringify(txn);
        console.log(jsonMsg);

        publish(txn);
    }
    var tsTable = document.getElementById('transaction-table');
        var dt = new Date().toLocaleString().replace(',', '');
        tsTable.insertRow().innerHTML = "<td scope='row'>" + rowts + "</td>" + "<td>" + dt + "</td>" + "<td>" + "Bank card exit generated." + "</td>";
        rowts++;
}

function genTxnObj(msg_id) {
    var d = Date.now();
    var sec = seconds_since_epoch(d);

    if(g_devSel == null) {
        return null;
    }    
    
    var transaction =  {
        "topic":"dev_websocket_app_msg",
        "header": {
            "version":1,
            "unix_epoch_sec":sec,
            "notify_msg":"gen_gate_txn"
        },
        "device_Info": {
            "equipment_Id": g_devSel.equip_num,
            "station_id":g_devSel.station_id,
            "dev_type":g_devSel.type,
            "dev_seq_no":g_devSel.seq_num
        },
        "payload": {
            "msg_id": msg_id
        }
    }

    return transaction;
}