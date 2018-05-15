
var page_ready = false;
//this array will be updated on load
var most_used_devices = [
    {"type": "tete",
     "room": "mia",
     "status":"OFF"}];

var length_most_used = 3;

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
    update_most_used();

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


function update_most_used()
{
    get_all_devices();
}


function get_all_devices()
{
    $.get('http://127.0.0.1:8080/api/devices/').done( function(data){
        var dev_arr = data['devices'];
        var new_most_used = [];

        for(var i = 0; i < length_most_used; i++)
        {
            var best = {'meta':{'count': 0}};
            dev_arr.forEach(dev=>{
                var meta =  JSON.parse(dev.meta);
                dev.meta = meta;
                if(best.meta.count < dev.meta.count)
                {
                    best = dev;
                }
            });

            dev_arr = dev_arr.slice(dev_arr.indexOf(best),1);

            var new_dev = {};
            new_dev.type = get_type(best);
            new_dev.room = get_room(best);
            new_dev.status =  best.meta.status;
        }
        console.log(most_used_devices);
        most_used_devices = new_most_used;
        console.log(new_most_used);
        load_most_used();
    });
    

    function get_type(dev)
    {
        $.get('http://127.0.0.1:8080/api/rooms')
    }

}