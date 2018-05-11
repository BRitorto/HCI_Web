$(document).ready(function() {
    console.log( "ready!" );
    
    $('#add-device').off().on('click', addDevice);
    $.when(retrieveDeviceTypes()).then(show_device_types());

});



function addDevice(){
    $('#addDevice').modal();
    $('#save-button').off().on('click',function(data) {
        var type = $("#selectDeviceCategory").val(); 
        add_new_device(search_id_for_device_type(type));
    });
    $(document).off().keypress(function(e) {
        if(e.which == 13){
            var type = $("#selectDeviceCategory").val();
            add_new_device(search_id_for_device_type(type));
            $('#addRoom').modal('toggle');
        }
    });
    document.getElementById("dev-form").reset();

}


function search_id_for_device_type(name)
{
    var types = get_device_types();
    var id ;
    types.forEach(element => {

        if(element["name"] == get_dev_value_by_type(element["name"])){
            id = element["id"];
            
        }
            
    });

    return id;
}



function retrieveDeviceTypes()
{
    $.getJSON( "http://127.0.0.1:8080/api/devicetypes", function( data ) {
    
        localStorage.setItem('dev_types', JSON.stringify(data["devices"]));
    });
}

function get_device_types()
{
    data  = JSON.parse(localStorage.getItem('dev_types'));
    return data;
}

function set_device_types(element)
{
    $('#selectDeviceCategory').append('<option data-val="' + element["id"] + '">'+ get_dev_type_name(element) +'</option>')
}

function show_device_types()
{
    data  = JSON.parse(localStorage.getItem('dev_types'));
    data.forEach(element => {
        if(element["name"]!= "alarm"){
            create_new_type(element);
            set_device_types(element);
        }
       
    });
    
}

function create_new_type(element)
{
    var new_dev = '<a class="custom-pills nav-link" id="'+ element['id'] + '-tab" data-toggle="pill" href="#'+element['id'] +'" role="tab" aria-controls="v-pills-profile" aria-selected="false">';
    new_dev = new_dev + get_dev_type_name(element);
    new_dev = new_dev + '</a>';
    $('#v-pills-tab').append(new_dev);

    var new_acordion = '<div class="tab-pane fade show" id="'+ element['id'] +'" role="tabpanel" aria-labelledby="'+ element['id']+'-tab">';
    new_acordion = new_acordion + '<div class="accordion" id="room'+ element['name'] + '" data-parent="#selector">';
    new_acordion = new_acordion + '</div></div>';
    $('#v-pills-tabContent').append(new_acordion);

}


function add_new_device(id)
{
    var name = $("#deviceName").val();
    var device = {"name": name, "typeId":id};
    post_device(device);
    $('#addRoom').modal('toggle');
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


function get_dev_value_by_type(name)
{
    name = name.toLowerCase();
    switch(name){
        case 'blind': 
            return 'blind';
        case 'lamp':
            return 'lamp';
        case 'oven':
            return 'oven';
        case 'air Conditioner':
            return 'ac';
        case 'door':
            return 'door';
        case 'alarm':
            return 'alarm';
        case 'timer':
            return 'timer';
        case 'refrigerator':
            return 'refrigerator';
        
    }
}


function post_device(device)
{
    $.post("http://127.0.0.1:8080/api/devices",device,function(data){
        bind_dev_to_room(data["device"], get_current_room_id());
        //refresh_list_dev();
        create_dev(data["device"]);
    })
}


function create_dev(device)
{   
    var dev = '<div class="secondary-card card">';
    dev += '<div class="card-header" id="heading' + device["name"] + '">';
    dev += '<h5 class="mb-0">';
    dev += '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseLamp1" aria-expanded="false" aria-controls="collapseLamp1">';
    dev += device["name"];
    dev += '<div id="collapse" class="collapse" aria-labelledby="heading' + device["name"] +'" data-parent="#accordionExample">';
    dev += '<div class="card-body">';
    dev += "Settings";
    dev += '</div></div></div>';
    console.log($('#'+device["typeId"]).append(dev));
    $.when($('#'+device["typeId"]).find("div.accordion").append(dev)).then(console.log("success"));

}


function refresh_list_dev()
{

}

function get_current_room_id()
{
    return sessionStorage.getItem("current_room");
}

function bind_dev_to_room(device, room_id)
{
    $.post("http://127.0.0.1:8080/api/devices/"+device["id"]+"/rooms/"+room_id,function(){
        console.log("successfully bidn device to room");
    } )
}