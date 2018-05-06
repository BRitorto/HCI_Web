
var page_ready = false;
//this array will be updated on load
var most_used_devices = [
    {"type": "tete",
     "room": "mia",
     "status":"OFF"}];

$(document).ready(function() {
    console.log( "ready!" );
    page_ready = true;
    $('#add-device').on('click', addDevice);
    $('#add-room').on('click', addRoom);

    function addRoom(){
        $('#addRoomFromMain').modal();
    }

    function addDevice(){
        $('#addDeviceFromMain').modal();
    }

    load_most_used();


});

// needed for every function in this file
function check_page_status()
{
    return page_ready;
}


// most used dev 
function load_most_used()
{   
    if(!check_page_status())
    {
        return;
    }
    console.log("loding most used devices...");
    most_used_devices.forEach(element => {
        console.log("creating new device");
        create_new_device(element);
    });
    
}


function create_new_device(device)
{
    var new_dev = '<tr class="device">';
    var dev_type = '<th class = "dev_type" >' + device["type"] + '</th>';
    var dev_room = '<td class="dev_room">' + device["room"] + '</td>';
    var dev_status = '<td class="dev_status">' + device["status"] + '</td>';
    var end_dev = '</tr>';
    new_dev = new_dev + dev_type + dev_room + dev_status + end_dev;
    $('#most_used_dev_table').append(new_dev);
    console.log("cerated new room!");
    
}

