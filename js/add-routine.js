var selected_rooms = new Array();
var all_rooms = new Array();
var selected_devices_per_room = new Array();
var devices_per_room = new Array();
var routine = {}

$(document).ready(function() {
    console.log( "ready!" );
    page_ready = true;

    $("#check-all").on('click', check_all);
    $("#next1").on('click', save_name);
    $("#next2").on('click', save_selected_rooms);
    $("#next3").on('click', save_selected_devices);



    //$("#previous1").on('click', refresh_rooms);
    //$("#previous2").on('click', refresh_devices);
    // al final hacer essto document.getElementById("name-form").reset();

});

function save_name()
{
    var name = $("#routine-name").val();
    if (name.length < 4)
    {
        alert("mal nombre");
    }
    else 
    {
        routine.name = name;
    }
    $("#name-tab").attr('class', 'nav-link disabled');
    $("#rooms-tab").attr('class', 'nav-link active show');
    $("#name").attr('class', 'tab-pane fade show');
    $("#rooms").attr('class', 'tab-pane fade show active');
    
    get_rooms();
}

function check_all()
{

    $("input:checkbox").prop('checked', $(this).prop('checked'));
}

function check_page_status()
{
    return page_ready;
}

function get_rooms()
{
    $.getJSON( "http://127.0.0.1:8080/api/rooms", function( data ) {
    
        load_rooms(data['rooms']);
    });
}

function load_rooms(rooms)
{
    if(!check_page_status)
    {
        return;
    }
    rooms.forEach(room => {
        var new_checkbox = create_new_checkbox(room);
        $(".choose-rooms").append(new_checkbox);
        all_rooms.push(room);
    });
}

function create_new_checkbox(item)
{
    var new_checkbox = '<li>';
    new_checkbox += '<input type="checkbox" id="'+item['id']+'">';
    new_checkbox += '<label for="'+item['id']+'">';
    new_checkbox += item['name'];
    new_checkbox += '</label></li>';

    return new_checkbox;
}

function save_selected_rooms()
{
    all_rooms.forEach(room => {
        if ($('#'+room['id']+'').is(':checked'))
        {
            selected_rooms.push(room);
        }
    });

    select_devices();
    $("#rooms-tab").attr('class', 'nav-link disabled');
    $("#devices-tab").attr('class', 'nav-link active show');
    $("#rooms").attr('class', 'tab-pane fade show');
    $("#devices").attr('class', 'tab-pane fade show active');
}

function save_selected_devices()
{
    var first;
    var selected = {
        'room': null,
        'devices': new Array()
    }

    devices_per_room.forEach(room =>{
        first = true;
        if (room.devices.length > 0)
        {
            room.devices.forEach(device =>{
                if ($('#'+device['id']+'').is(':checked'))
                {
                    if (first)
                    {
                        console.log('selecciono los selected');
                        selected.room = room.room;
                        first = false;
                    }
                    selected.devices.push(device);
                }
                
            });
            selected_devices_per_room.push(selected);
        }
    });

    $("#devices-tab").attr('class', 'nav-link disabled');
    $("#settings-tab").attr('class', 'nav-link active show');
    $("#devices").attr('class', 'tab-pane fade show');
    $("#settings").attr('class', 'tab-pane fade show active');

    show_actions();
}

function show_actions()
{
    selected_devices_per_room.forEach(element=>{
        console.log(element);
        var new_room = display_room_and_settings(element.room);
        $("#selected-rooms-and-devs").append(new_room);

        element.devices.forEach(device=>{
            var new_device = display_device_and_settings(device);
            $("#"+element.room['name']+"-devices").append(new_device);
        })
    })
}

function retrieve_device_types()
{
    $.getJSON( "http://127.0.0.1:8080/api/devicetypes", function( data ) {
    
        localStorage.setItem('dev_types', JSON.stringify(data["devices"]));
    });
}

function select_devices()
{
    selected_rooms.forEach(room => {
        var new_room = display_room(room);
        $("#selected-rooms").append(new_room);
        var device_list = $.get("http://127.0.0.1:8080/api/rooms/"+room['id']+"/devices",function (data) {
            var room_array = {
                'room':room,
                'devices':data['devices']
            }
            devices_per_room.push(room_array);
            create_types(data['devices'], room);
          });
    });
}

function create_types(devices, room)
{
    var aux = new Array();
    devices.forEach(device =>{
        aux.push(device['typeId']);
    });

    var types = new Set(aux);
    types.forEach(type =>{
        display_type(type, room);
    });
    display_devices(devices, room);
}

function display_devices(devices, room)
{
    devices.forEach(device =>{
        display_device(device, room);
    });
}

function display_room(room)
{
    var new_room = '<li id="'+room['name']+'">';
    new_room += '<div class="row">';
    new_room += '<div class="col-md-4">';
    new_room += '<h3>'+room['name']+'</h3>';
    new_room += '<ul id="'+room['name']+'-types" class="list-unstyled">';
    new_room += '</ul >';
    new_room += '</div></div>';

    return new_room;
}

function display_room_and_settings(room)
{
    var new_room = '<li id="'+room['name']+'">';
    new_room += '<div class="row">';
    new_room += '<div class="col-md-4">';
    new_room += '<h3>'+room['name']+'</h3>';
    new_room += '<ul id="'+room['name']+'-devices" class="list-unstyled">';
    new_room += '</ul >';
    new_room += '</div></div>';

    return new_room;
}

function display_type(type, room)
{
    var selected_room = '#'+room['name']+'-types';
    var new_type = '<li>';
    new_type += '<h4>'+get_type_name(type)+'</h4>';
    new_type += '<ul id= "'+type+'-devices" class="list-unstyled">';
    new_type += '</ul>';
    new_type += '</li>';

    $(selected_room).append(new_type);
}

function display_device_and_settings(device)
{
    var new_device = '<li>';
    new_device += '<div class="device-box">';
    new_device += '<h4>';
    new_device += device['name'];
    new_device += '</h4>';
    new_device += load_settings(device);

    new_device += '</div>';
    new_device += '</li>';



    return new_device;
}

function load_settings(device)
{
    var type_id = device['typeId'];
    switch(type_id){
        case "eu0v2xgprrhhg41g":
            return load_blind_settings(device);
        case "go46xmbqeomjrsjr":
            return load_lamp_settings(device);
        case "im77xxyulpegfmv8":
            return load_oven_settings(device);
        case "li6cbv5sdlatti0j":
            return load_ac_settings(device);
        case "lsf78ly0eqrjbz91":
            return load_door_settings(device);
        case "ofglvd9gqX8yfl3l":
            return load_timer_settings(device);
        case "rnizejqr2di0okho":
            return load_refrigerator_settings(device);
        

    } 
}

function load_blind_settings(device)
{
    var settings = '<div class="form-group">';
    settings += '<h5>Set state</h5>';
    settings += '<select class="form-control settings-form" id="form-blind-state-' + device["id"] + ' value=" ">';
    settings += '<option>up</option>';
    settings += '<option>down</option>';
    settings += '</select>';
    settings += '</div>';

    return settings;
}

function load_lamp_settings(device)
{
    var settings = '<div class="settings">';
    settings += '<div class="row">';
    settings += '<div class="col-8">';
    settings += '<div class="form-group">';
    settings += '<h5>Set state</h5>';
    settings += '<select class="form-control settings-form" id="form-lamp-state-' + device["id"] + ' value=" ">';
    settings += '<option>off</option>';
    settings += '<option>on</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<h5>Color</h5>';
    settings += '<input class="form-control settings-form" type="color" value="" >';
    settings += '<h5>Brightness</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="1" max="100" value="" class="slider" id=lamp-' + device['id']+'>';
    settings += '<span id="b'+ device['id'] +'">'+'VALUE' +'</span>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    return settings;
}

function load_oven_settings(device)
{
    var settings = '<div class="settings">';
    settings += '<div class="row">';
    settings += '<div class="col-8">';
    settings += '<div class="form-group">';
    settings += '<h5>Set state</h5>';
    settings += '<select class="form-control settings-form" id="form-lamp-state-' + device["id"] + ' value=" ">';
    settings += '<option>off</option>';
    settings += '<option>on</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<h5>Temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="90" max="230" value="" class="slider" id=oven-' + device['id']+'>';
    settings += '<span id="t'+ device['id'] +'">'+ 'VALUE'+'</span>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set heat</h5>';
    settings += '<select class="form-control settings-form" id="form-heat-' + device["id"] + ' value="" ">';
    settings += '<option>conventional</option>';
    settings += '<option>bottom</option>';
    settings += '<option>top</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set grill</h5>';
    settings += '<select class="form-control settings-form" id="form-grill-' + device["id"] + ' value="" ">';
    settings += '<option>large</option>';
    settings += '<option>eco</option>';
    settings += '<option>off</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set convection</h5>';
    settings += '<select class="form-control settings-form" id="form-convection-' + device["id"] + ' value="" ">';
    settings += '<option>normal</option>';
    settings += '<option>eco</option>';
    settings += '<option>off</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';

    return settings;
    
}

function load_ac_settings(device)
{
    var settings = '<div class="settings">';
    settings += '<div class="row">';
    settings += '<div class="col-8">';
    settings += '<div class="form-group">';
    settings += '<h5>Set state</h5>';
    settings += '<select class="form-control settings-form" id="form-lamp-state-' + device["id"] + ' value=" ">';
    settings += '<option>off</option>';
    settings += '<option>on</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<h5>Temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="18" max="38" value="" class="slider" id=ac-' + device['id']+'>';
    settings += '<span id="a'+ device['id'] +'">'+ 'VALUE'+'</span>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set mode</h5>';
    settings += '<select class="form-control settings-form" id="form-mode-' + device["id"] + ' value="" ">';
    settings += '<option>cool</option>';
    settings += '<option>heat</option>';
    settings += '<option>fan</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set vertical swing</h5>';
    settings += '<select class="form-control settings-form" id="form-vertical-' + device["id"] + ' value="" ">';
    settings += '<option>Auto</option>';
    settings += '<option>22</option>';
    settings += '<option>45</option>';
    settings += '<option>67</option>';
    settings += '<option>90</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set horizontal swing</h5>';
    settings += '<select class="form-control settings-form" id="form-horizontal-' + device["id"] + ' value="" ">';
    settings += '<option>Auto</option>';
    settings += '<option>- 90</option>';
    settings += '<option>- 45</option>';
    settings += '<option>0</option>';
    settings += '<option>45</option>';
    settings += '<option>90</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set fan speed</h5>';
    settings += '<select class="form-control settings-form" id="form-speed-' + device["id"] + ' value="" ">';
    settings += '<option>Auto</option>';
    settings += '<option>25</option>';
    settings += '<option>50</option>';
    settings += '<option>75</option>';
    settings += '<option>100</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    return settings;
}

function load_door_settings(device)
{
    var settings = '<div class="settings">';
    settings += '<div class="row">';
    settings += '<div class="col-8">';
    settings += '<div class="form-group">';
    settings += '<h5>Set state</h5>';
    settings += '<select class="form-control settings-form" id="form-lamp-state-' + device["id"] + ' value=" ">';
    settings += '<option>off</option>';
    settings += '<option>on</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set lock</h5>';
    settings += '<select class="form-control settings-form" id="form-lock-' + device["id"] + ' value="">';
    settings += '<option>On</option>';
    settings += '<option>Off</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    return settings;
}

function load_timer_settings(device)
{   

    var settings = '<div class="settings">';
    settings += '<div class="row">';
    settings += '<div class="col-8">';
    settings += '<div class="form-group">';
    settings += '<h5>Set state</h5>';
    settings += '<select class="form-control settings-form" id="form-lamp-state-' + device["id"] + ' value=" ">';
    settings += '<option>off</option>';
    settings += '<option>on</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<h5>Time</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="0" max="21474836" value="" class="slider" id=timer-' + device['id']+'>';
    settings += '<span id="c'+ device['id'] +'"></span>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set alarm</h5>';
    settings += '<select class="form-control settings-form" id="form-timer-' + device["id"] + ' value="">';
    settings += '<option>Start</option>';
    settings += '<option>Stop</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    return settings;
}

function load_refrigerator_settings(device)
{
    var settings = '<div class="settings">';
    settings += '<div class="row">';
    settings += '<div class="col-8">';
    settings += '<div class="form-group">';
    settings += '<h5>Set state</h5>';
    settings += '<select class="form-control settings-form" id="form-lamp-state-' + device["id"] + ' value=" ">';
    settings += '<option>off</option>';
    settings += '<option>on</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<h5>Set freezer temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="-20" max="-10" value="" class="slider" id=freezer-' + device['id']+' >';
    settings += '<span id="f'+ device['id'] +'">' + 'VALUE'+ '</span>';
    settings += '</div>';
    settings += '<h5>Set refrigerator temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="2" max="8" value="" class="slider" id=refrigerator-' + device['id']+'>';
    settings += '<span id="r'+ device['id'] +'">' + 'VALUE'+ '</span>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set mode</h5>';
    settings += '<select class="form-control settings-form" id="form-refrigerator-' + device["id"] + ' value="">';
    settings += '<option>Default</option>';
    settings += '<option>vacations</option>';
    settings += '<option>party</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    return settings;
}


function display_device(device, room)
{
    var new_device = create_new_checkbox(device);

    var selected_room = '#'+room['name']+'-types';
    var selected_type = '#'+device['typeId']+'-devices';
    $(selected_room).find(selected_type).append(new_device);
}

function get_type_name(id)
{
    switch(id)
    {
        case 'eu0v2xgprrhhg41g': 
            return 'Blinds';
        case 'go46xmbqeomjrsjr':
            return 'Lamps';
        case 'im77xxyulpegfmv8':
            return 'Ovens';
        case 'li6cbv5sdlatti0j':
            return 'Air Conditioners';
        case 'lsf78ly0eqrjbz91':
            return 'Doors';
        case 'mxztsyjzsrq7iaqc':
            return 'Alarm';
        case 'ofglvd9gqX8yfl3l':
            return 'Timer';
        case 'rnizejqr2di0okho':
            return 'Refrigerator';
    }
}
