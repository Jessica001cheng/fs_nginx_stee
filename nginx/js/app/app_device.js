let g_devConfig = [
    {   "equip_num": "G01", "station_id": 73, "type": 49, "seq_num": 3231   },
    {   "equip_num": "G02", "station_id": 73, "type": 52, "seq_num": 2231   },
    {   "equip_num": "G03", "station_id": 73, "type": 53, "seq_num": 73031  },
    {   "equip_num": "G04", "station_id": 73, "type": 54, "seq_num": 73041  },
    {   "equip_num": "G05", "station_id": 73, "type": 55, "seq_num": 73051  },
    {   "equip_num": "G06", "station_id": 73, "type": 56, "seq_num": 73061  },
    {   "equip_num": "G07", "station_id": 73, "type": 57, "seq_num": 73071  },
    {   "equip_num": "G08", "station_id": 73, "type": 58, "seq_num": 73081  },
    {   "equip_num": "G09", "station_id": 73, "type": 59, "seq_num": 73091  },
    {   "equip_num": "G10", "station_id": 73, "type": 60, "seq_num": 73101  },
  ]

let g_devSel = null;

function onDeviceSelected(event) {
    switch(this.options[this.selectedIndex].text) {
        case "G01":
          g_devSel = g_devConfig[0]; 
          break;
        case "G02":
          g_devSel = g_devConfig[1];
          break;
        case "G03":
            g_devSel = g_devConfig[2];
            break;
        case "G04":
            g_devSel = g_devConfig[3];
            break;
        case "G05":
            g_devSel = g_devConfig[4];
            break;
        case "G06":
            g_devSel = g_devConfig[5];
            break;
        case "G07":
            g_devSel = g_devConfig[6];
            break;
        case "G08":
            g_devSel = g_devConfig[7];
            break;
        case "G09":
            g_devSel = g_devConfig[8];
            break;
        case "G10":
            g_devSel = g_devConfig[9];
            break;
        default:
          // code block
      }
    if(g_devSel != null){
        if( true == g_consoleLog ) {
            console.log("Device Selected: " + g_devSel.equip_num.toString() +
                    ", Type: " + g_devSel.type.toString() + 
                    ", Seq_Number: " + g_devSel.seq_num.toString()
                    );
        }
    }
    //alert(this.options[this.selectedIndex].text);
}

function deviceSelect(dev) {
    switch(dev) {
        case "G01":
          g_devSel = g_devConfig[0]; 
          break;
        case "G02":
          g_devSel = g_devConfig[1];
          break;
        case "G03":
            g_devSel = g_devConfig[2];
            break;
        case "G04":
            g_devSel = g_devConfig[3];
            break;
        case "G05":
            g_devSel = g_devConfig[4];
            break;
        case "G06":
            g_devSel = g_devConfig[5];
            break;
        case "G07":
            g_devSel = g_devConfig[6];
            break;
        case "G08":
            g_devSel = g_devConfig[7];
            break;
        case "G09":
            g_devSel = g_devConfig[8];
            break;
        case "G10":
            g_devSel = g_devConfig[9];
            break;
        default:
          // code block
      }
    if(g_devSel != null){
        if( true == g_consoleLog ) {
            console.log("Device Selected: " + g_devSel.equip_num.toString() +
                    ", Type: " + g_devSel.type.toString() + 
                    ", Seq_Number: " + g_devSel.seq_num.toString()
                    );
        }
    }
    //alert(this.options[this.selectedIndex].text);
}

function isValidDevice(inEquipIdStr, inTypeInt, inSeqNumberInt)
{
    if(g_devSel == null)
        return false;
    
    if( (inEquipIdStr == g_devSel.equip_num) && (inTypeInt == g_devSel.type) && (inSeqNumberInt == g_devSel.seq_num) ){
        return true;
    }
    else {
        return false;
    }
}
