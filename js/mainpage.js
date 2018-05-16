
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
    
    update_most_used();
    $('#add-room').off().on('click', show_room_form);
    $('#add-device').off().on('click', add_device);

});

function add_device()
{
    
}

function show_room_form()
{
    $('#add-room-modal').modal();
    $('#add-room-save').off().on('click', add_new_room);
    $(document).off().keypress(function(e) {
        if(e.which == 13){
            add_new_room();
            $('#add-room-modal').modal('toggle');
        }
    });
    document.getElementById("room-form").reset();
}


function add_new_room()
{
    if(!check_page_status)
    {
        return;
    }
    var name = $("#new-room-name").val();
    var room = {"name": name};
    $.post(base_api+'rooms/',room,function(){
    }).fail(function(data){
        var response =  JSON.parse((data['responseText']));
        switch(response.error.code){
            case 1:
                alert('bad input, try only alfanumeric names');
                break;
            case 2:
                alert('codigo 2');
                break;

            case 3:
                alert("codigo 3");
                break;

            case 4:
                alert("something went wrong, please try again in a few moments");
                break;
        }
    });
    $('#add-room-modal').modal('toggle');
}

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
        dev_arr.forEach(dev=>{
            dev.meta =  JSON.parse(dev.meta);
        });

        for(var i = 0; i < length_most_used; i++)
        {
            var best = {'meta':{'count':0}};
            dev_arr.forEach(dev=>{
                if(best.meta.count < dev.meta.count)
                {   
                    best = dev;
                }
            });

            console.log(dev_arr);
            dev_arr = dev_arr.filter(e => e !== best);
            var new_dev = {};

            new_dev.type = get_type(best);
            console.log(get_type(best));
            new_dev.room = get_room(best);
            new_dev.status =  best.meta.status;
            new_most_used.push(new_dev);

        }
        most_used_devices = new_most_used;
        load_most_used();
        update_listeners();
    });
     
}


function get_type(dev)
{
    $.get('http://127.0.0.1:8080/api/devicetypes').done(
        function (data){
            data['devices'].forEach(type=>{
                if(dev['typeId'] == type['id']){
                    sessionStorage.setItem("type_name",type['name']);
                    console.log(sessionStorage.getItem("type_name"));
                    console.log(type['name']);
                    return;
                }
                    
            });
        }
    );

    return sessionStorage.getItem("type_name");
}


function get_room(dev)
{
    $.get('http://127.0.0.1:8080/api/rooms').done(
        function(data){
            data['rooms'].forEach(room =>{
                if(dev_in_room(dev, room['id']))
                    sessionStorage.setItem('room',room['name']);
            });
        }
    );

    return sessionStorage.getItem('room');
}


function dev_in_room(dev, room_id) 
{ 
    sessionStorage.setItem("is_room", false);
    $.get('http://127.0.0.1:8080/api/rooms/'+room_id+'/devices').done(
        function(data){
            data['devices'].forEach(device=>{
                if(device.id == dev.id)
                    sessionStorage.setItem("is_room", true);
            });
        }
    );

    return sessionStorage.getItem("is_room");
}