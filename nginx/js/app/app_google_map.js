// Global objects for Google map
let g_MapDefLoc = { lat: 1.323941, lng: 103.9290873 };
let g_MapCurLoc = g_MapDefLoc;
let g_MapMarkerObj;
let g_MapObj;

// Initialize and add the map
function initMap() {
    // The map, centered at cur_loc
    g_MapObj = new google.maps.Map(document.getElementById("map"), {
            zoom: 16,
            center: g_MapCurLoc,
    });

    // The marker, positioned at cur_loc
    g_MapMarkerObj = new google.maps.Marker({
            position: g_MapCurLoc,
            icon: 'images/bus.png',
            map: g_MapObj,
    });
} 
