var selected_rooms = new Array();
var all_rooms = new Array();
var routine = {}

$(document).ready(function() {
    console.log( "ready!" );
    page_ready = true;

    get_rooms();
    retrieve_device_types();
    $("#check-all").on('click', check_all);
    $("#next1").on('click', put_name);
    $("#next2").on('click', save_selected_rooms);

    // al final hacer essto document.getElementById("name-form").reset();

});

function put_name()
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
}

function check_all()
{
    $(".form-check-input").prop('checked', $(this).prop('checked'));
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
        create_new_checkbox(room);
        all_rooms.push(room);
        console.log("creating new room");
    });
}

function create_new_checkbox(room)
{
    var new_checkbox = '<li>';
    new_checkbox += '<input class="form-check-input" type="checkbox" id="'+room['id']+'">';
    new_checkbox += '<label class="form-check-label" for="'+room['name']+'">';
    new_checkbox += '<h5>';
    new_checkbox += room['name'];
    new_checkbox += '<h5>'
    new_checkbox += '</label></li>';

    $(".choose-rooms").append(new_checkbox);
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
        console.log(room['name']);
        console.log(room['id']);
        display_room(room);
        var device_list = $.get("http://127.0.0.1:8080/api/rooms/"+room['id']+"/devices",function (data) {
            var arr =  data['devices'];
            create_types(arr, room);
            //display_devices(devices, room);
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
    new_room += '<div class="row"><div class="col-md-4">';
    new_room += '<h4>'+room['name']+'</h4>';
    new_room += '</div></div><div class="row"><div class="col-3">';
    new_room += '<div class="nav flex-column nav-pills" id="'+room['name']+'-tab" role="tablist" aria-orientation="vertical">';
    new_room += '</div></div></div></li>';

    $("#selected-rooms").append(new_room);
}

function display_type(type, room)
{
    var selected_room = '#'+room['name']+'-tab'
    var new_type = '<a class="custom-pills nav-link " id="'+type+'-tab" data-toggle="pill" href="#'+type+'" role="tab" aria-controls="'+type+'" aria-selected="false">'
    new_type += get_type_name(type);
    new_type += '</a>';
    new_type += '<div class="tab-content" id="'+type+'-tabContent">';
    new_type += '<div class="tab-pane fade show" id="'+type+'" role="tabpanel" aria-labelledby="'+type+'-tab">';
    new_type += '<ul class="choose-'+type+'">';
    new_type += '<li>'
    new_type += '<input class="form-check-input" type="checkbox" value="" id="check-all">';
    new_type += '<label class="form-check-label" for="check-all">';
    new_type += '<h5>Choose all</h5>';
    new_type += '</label>';
    new_type += '</li>';
    new_type += '</ul></div></div>';

    $(selected_room).append(new_type);
}

function display_device(device, room)
{
    var new_device = create_new_checkbox(device);

    var selected_room = '#'+room['name']+'-tab';
    $(selected_room).closest('ul').append(new_device);
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
