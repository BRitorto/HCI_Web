var wait = 0;
var page_ready = false;
//this array will be updated on load
var most_used_devices = [];

var length_most_used = 3;

$(document).ready(function() {
    page_ready = true;
    sessionStorage.setItem("mostUsed",JSON.stringify([]));
    get_rooms();
    retrieve_device_types();
    retrieve_rooms();
    update_most_used();
    $('#add-room').off().on('click', show_room_form);
    $('#add-device').off().on('click', add_device_modal);
    $('#button-select-room').off().on('click', function(){
        $('#select-room-form').prop('disabled', false);
        $('#new-room-form').prop('disabled', true);
    });
    $('#button-add-room').off().on('click', function(){
        $('#select-room-form').prop('disabled', true);
        $('#new-room-form').prop('disabled', false);
    });
});

function add_device_modal()
{
    $('#add-device-modal').modal();
    $('#add-device-save').off().on('click', function(){
        var dev_name =  $('#device-name').val();
        var dev_type = $('#device-type').val();
        if (document.getElementById("select-room-form").disabled)
        {
            var room = $('#new-device-room-name').val();
            if(validate(room))
                add_room(room, dev_name, dev_type);
            else
                alert("Name should be between 3 and 60 characters long");
        }
        else
        {
            var room_id = $('#select-room').find('option:selected').attr("data-val");
            if(validate(dev_name))
                add_device(dev_name, dev_type, room_id);
            else
                alert("Name should be between 3 and 60 characters long");
        }
    })

}

function set_current_room(room_id)
{
    sessionStorage.setItem("current_room",room_id );
    $.get(base_api+"rooms/"+ room_id,function (data){
        sessionStorage.setItem("current_room_name",data['room']["name"]);
    });
}

function add_device(dev_name, dev_type, room_id){
    
    var id = search_id_for_device_type(dev_type);
    var device = {'name': dev_name, 'typeId':id, 'meta':JSON.stringify(get_meta_for_dev(id))};
    post_device(device, room_id);  

}

function get_meta_for_dev(typeId)
{
    switch(typeId){
        case "eu0v2xgprrhhg41g":
            return {'status': 'down', 'count': 0};
        case "go46xmbqeomjrsjr":
            return {'status':'off','color':'#563d7c', 'brightness':'50', 'count':0};
        case "im77xxyulpegfmv8":
            return {'status':'off', 'temperature':'180','heat':'conventional','grill':'large','convection':'normal' , 'count':0};
        case "li6cbv5sdlatti0j":
            return {'status':'off','temperature':'24','mode':'cool','vertical_swing':'auto','horizontal_swing':'auto','fan':'auto' , 'count':0};
        case "lsf78ly0eqrjbz91":
            return {'status':'close','lock':'off' , 'count':0};
        case "ofglvd9gqX8yfl3l":
            return {'status':'off','time':'0' , 'count':0};
        case "rnizejqr2di0okho":
            return {'status':'off','freezer':'-10','refrigerator':'4','mode':'default' , 'count':0};
        
    }
}


function search_id_for_device_type(name)
{
    var types = get_device_types();
    var id ;
    types.forEach(element => {

        if(get_dev_type_name(element) == name){
            id = element['id'];
        }       
    });
    return id;
}
function get_dev_type_name(element){
    switch(element['name']){
        case 'blind': 
            return 'Blind';
        case 'lamp':
            return 'Lamp';
        case 'oven':
            return 'Oven';
        case 'ac':
            return 'Air Conditioner';
        case 'door':
            return 'Door';
        case 'alarm':
            return 'Alarm';
        case 'timer':
            return 'Timer';
        case 'refrigerator':
            return 'Refrigerator';
        
    }
}

function post_device(device, room)
{

   $.post( base_api+"devices",device).fail(function(data){
    var response =  JSON.parse((data['responseText']));
    switch(response.error.code){
        case 1:
            alert('device There was an error in the input, please try only alfanumeric values.');
            break;
        case 2:
            alert('The device name is already in use, try another one');
            break;

        case 3:
            alert("There was a problem with the server. Try reloading the page");
            break;

        case 4:
            alert("Something went wrong, please try again in a few moments");
            break;
    }
}).done(function(data){
    bind_dev_to_room(data['device'], room);
    });
}

function bind_dev_to_room(device, room_id)
{
    $.post(base_api + "devices/"+device['id']+"/rooms/"+room_id,function(){
    } ).fail(function(data){
        var response =  JSON.parse((data['responseText']));
        switch(response.error.code){
            case 1:
                alert('bind dev There was an error in the input, please try only alfanumeric values.');
                break;
            case 2:
                alert('bind dev The name is already in use, try another one');
                break;

            case 3:
                alert("There was a problem with the server. Try reloading the page");
                break;

            case 4:
                alert("Something went wrong, please try again in a few moments");
                break;
        }
    }).done(function(){
        set_current_room(room_id);  
        location.href = "./room.html";
    });
}

function retrieve_device_types()
{
    $.getJSON( base_api+ "devicetypes").
    done(function (data){

        data['devices'] = data['devices'].filter(e => e['name'] != "timer");

        localStorage.setItem('dev_types', JSON.stringify(data["devices"]));
        show_device_types();
    });
}

function retrieve_rooms()
{
    $.getJSON( base_api+ "rooms").
    done(function (data){

        localStorage.setItem('all_room', data["rooms"]);
    });
}

function show_device_types()
{
    data  = JSON.parse(localStorage.getItem('dev_types'));
    data.forEach(element => {
        if(element["name"]!= "alarm" && element["name"]!= "timer"){
            $('#device-type').append('<option data-val="' + element["id"] + '">'+ get_dev_type_name(element) +'</option>');
        }
    });
    
}

function get_device_types()
{
    data  = JSON.parse(localStorage.getItem('dev_types'));
    return data;
}

function add_room(name, dev_name, dev_type)
{
    var room_id;
    if(!check_page_status)
    {
        return;
    }
    var room = {"name": name};
    $.post(base_api+'rooms/',room,function(data){
        room_id = data.room['id'];

    }).fail(function(data){
        var response =  JSON.parse((data['responseText']));
        switch(response.error.code){
            case 1:
                alert('There was an error in the input, please try only alfanumeric values.');
                break;
            case 2:
                alert('The name is already in use, try another one');
                break;

            case 3:
                alert("There was a problem with the server. Try reloading the page");
                break;

            case 4:
                alert("Something went wrong, please try again in a few moments");
                break;
        }
    }).done(function(){
        add_device(dev_name, dev_type, room_id);
    });
}

function show_room_form()
{   
    $('#add-room-modal').modal();
    $('#add-room-save').off().on('click', function(){
        if(validate($("#new-room-name").val()))
            add_new_room();
        else
            alert("Name should be between 3 and 60 characters long");
        
    });
}

function check_validity(selector) 
{  
    var status = $(selector).validity;
    if(status.tooShort)
    {
        alert("The name must be at least 3 characters long");
        return false;
    }
    if(status.tooLong)
    {
            alert("the name must be less than 60 characters");
            return false;
   }
   return true;
}

function add_new_room()
{


    var name = $("#new-room-name").val();
    var room = {"name": name};
    $.post(base_api+'rooms/',room,function(data){
        room_id = data.room['id'];
    }).fail(function(data){
        var response =  JSON.parse((data['responseText']));
        switch(response.error.code){
            case 1:
                alert('There was an error in the input, please try only alfanumeric values.');
                break;
            case 2:
                alert('The room name is already in use, try another one');
                break;

            case 3:
                alert("There was a problem with the server. Try reloading the page");
                break;

            case 4:
                alert("Something went wrong, please try again in a few moments");
                break;
        }
    }).done(function(){
        set_current_room(room_id);  
        location.href = "./room.html";
    });

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

    $('.device').remove();
    most_used_devices = JSON.parse(sessionStorage.getItem('mostUsed'));
    most_used_devices.forEach(element => {
        create_new_device(element);
    });
    
}


function create_new_device(device)
{
    var new_dev = '<tr class="device">';
    var dev_type = '<th class = "dev_name" >' + device["name"] + '</th>';
    var dev_room = '<td class="dev_room"><a href="room.html" class="to_the_room" data-target='+device["room"]['id']+' >' + device["room"]['name'] + '</a></td>';
    var dev_status = '<td class="dev_status">' + device["status"] + '</td>';
    var end_dev = '</tr>';
    new_dev = new_dev + dev_type + dev_room + dev_status + end_dev;
    $('#most_used_dev_table').append(new_dev);

    $('.to_the_room').off().on('click',function(){
        set_current_room($(this).attr('data-target'));
    });
}


function update_most_used()
{
    get_all_devices();
}


function get_all_devices()
{
    $.get(base_api+'devices/').done( function(data){
        var dev_arr = data['devices'];
        var new_most_used = [];
        dev_arr.forEach(dev=>{
            dev.meta =  JSON.parse(dev.meta);
        });
        var mosts = [];
        for(var i = 0; i < length_most_used; i++)
        {
            var best = {'meta':{'count':0}};
            dev_arr.forEach(dev=>{
                if(best.meta.count < dev.meta.count)
                {   
                    best = dev;
                }
            });
            dev_arr = dev_arr.filter(e => e !== best);
            mosts.push(best);
        }
        mosts.forEach(best=>{
            var new_dev = {};
            new_dev.name = best.name;
            new_dev.status =  best.meta.status;
            $.get(base_api+'rooms').done(function(data){
                data['rooms'].forEach(room=>{
                    $.get(base_api+'rooms/'+room.id+'/devices').done(function(data){

                        data['devices'].forEach(dev=>{
                            if(dev.id == best.id)
                            {
                                var arr = JSON.parse(sessionStorage.getItem("mostUsed"));
                                new_dev.room = room;
                                arr.push(new_dev);
                                sessionStorage.setItem("mostUsed",JSON.stringify(arr));
                            }
                        });

                        load_most_used();
                    });
                });
                
                
            });
        });
            
            
        
        //update_listeners();
    });
     
}




function get_room(dev)
{
    $.get(base_api+'rooms').done(
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
    $.get(base_api+'rooms/'+room_id+'/devices').done(
        function(data){
            data['devices'].forEach(device=>{
                if(device.id == dev.id)
                    sessionStorage.setItem("is_room", true);
            });
        }
    );

    return sessionStorage.getItem("is_room");
}


function get_type(dev)
{
    var return_value;
    $.get(base_api+'devicetypes').done(
        function (data){
            data['devices'].forEach(type=>{
                if(dev['typeId'] == type['id'])
                   sessionStorage.setItem("type_name",type['name']);
            });
        }
    );

    return sessionStorage.getItem("type_name");
}

function get_room(dev)
{
    $.get(base_api+'rooms').done(
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
    $.get(base_api+'rooms/'+room_id+'/devices').done(
        function(data){
            data['devices'].forEach(device=>{
                if(device.id == dev.id)
                    sessionStorage.setItem("is_room", true);
            });
        }
    );
}

function get_rooms()
{
    $.getJSON( base_api+"rooms", function( data ) {
        load_rooms(data['rooms'])}).fail(function(data){
            var response =  JSON.parse((data['responseText']));
            switch(response.error.code){
                case 1:
                    alert('There was an error in the input, please try only alfanumeric values.');
                    break;
                case 2:
                    alert('The name is already in use, try another one');
                    break;
    
                case 3:
                    alert("There was a problem with the server. Try reloading the page");
                    break;
    
                case 4:
                    alert("Something went wrong, please try again in a few moments");
                    break;
            }
        });
}

function load_rooms(rooms)
{
    if(!check_page_status)
    {
        return;
    }
    rooms.forEach(room => {
        $('#select-room').append('<option data-val="' + room["id"] + '">'+ room['name'] +'</option>');
    });
    
}


function validate(value)
{
    if(value.length < 3 || value.length > 60)
        return false;
    return true;
}