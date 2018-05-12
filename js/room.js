var modal_on = false;
$(document).ready(function() {
    console.log( "ready!" );
    
    $('#add-device').off().on('click', add_device);
    $.when(retrieve_device_types()).
    then(show_device_types()).
    then(get_devices());
    


});



function add_device(){
    $('#add-device-form').modal();
    
    $('#save-button').off().on('click',function(data) {
        var type = $("#select-device-category").val(); 
        add_new_device(search_id_for_device_type(type));
        location.reload();
    });
    $(document).off().keypress(function(e) {
        if(e.which == 13){
            var type = $("#selectDeviceCategory").val();
            add_new_device(search_id_for_device_type(type));
            location.reload();
        }
    });
    document.getElementById("dev-form").reset();
    
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



function retrieve_device_types()
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
    $('#select-device-category').append('<option data-val="' + element["id"] + '">'+ get_dev_type_name(element) +'</option>')
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
    var new_dev = '<a class="custom-pills nav-link" id="'+ element['id'] + '-tab" data-toggle="pill" href="#'+element['name'] +'" role="tab" aria-controls="v-pills-profile" aria-selected="false">';
    new_dev = new_dev + get_dev_type_name(element);
    new_dev = new_dev + '</a>';
    $('#v-pills-tab').append(new_dev);

    var new_acordion = '<div class="tab-pane fade show" id="'+ element['name'] +'" role="tabpanel" aria-labelledby="'+ element['id']+'-tab">';
    new_acordion = new_acordion + '<div class="accordion" id="room'+ element['name'] + '" data-parent="#selector">';
    new_acordion = new_acordion + '<div class="secondary-card card">';
    new_acordion = new_acordion + '<ul id="'+element['id']+'" class="list-unstyled">';
    new_acordion = new_acordion + '</ul></div></div></div>';
    $('#v-pills-tabContent').append(new_acordion);
}


function add_new_device(id)
{
    var name = $("#device-name").val();
    console.log(name);
    var device = {'name': name, 'typeId':id};
    console.log(device);
    post_device(device);
    //$('#add-device-form').modal(close);
    console.log("finished");
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
        case 'air conditioner':
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
        //bind_dev_to_room(data['device'], get_current_room_id());
        //refresh_list_dev();
        create_dev(data['device']);
    })
}


function create_dev(device)
{   
    var list = '#'+device['typeId'];
    var dev = ' <li id="'+device['name']+'">';
    dev += '<div class="card-header" id="heading' + device['name'] + '">';
    dev += '<h5 class="mb-0">';
    dev += '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse' + device['name'] + '" aria-expanded="false" aria-controls="collapse'+ device['name'] +'">';
    dev += device['name'];
    dev += '<div id="collapse' + device['name'] + '" class="collapse" aria-labelledby="heading' + device['name'] +'" data-parent="#accordionExample">';
    dev += '<div class="card-body">';
    dev += "settings";
    dev += '</div></div></div></div>';
    dev += '</li>'
    

    
    $(list).append(dev);
    console.log("success");

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
    $.post("http://127.0.0.1:8080/api/devices/"+device['id']+"/rooms/"+room_id,function(){
        console.log("successfully bidn device to room");
    } )
}

function get_devices()
{

    var device_list = $.get("http://127.0.0.1:8080/api/rooms/"+get_current_room_id()+"/devices",function (data) {
        var arr =  data['devices'];
        arr.forEach(dev =>{
            create_dev(dev);
        })
      });

    
}


