$(document).ready(function() {
    console.log( "ready!" );
    $('#add-device-form').on('click', '#save-button', add_device);

    $.when(retrieve_device_types()).
    then(show_device_types()).
    then(get_devices());

    $('#current_room').text( "Room "+get_current_room_name());
    $('h1').text( "Room " + get_current_room_name());
    
});

function add_device(){
    
        var type = $("#select-device-category").val(); 
        add_new_device(search_id_for_device_type(type));
        console.log("adding device");

        /*$(document).off().keypress(function(e) {
            if(e.which == 13){
                var type = $("#select-device-category").val();
                add_new_device(search_id_for_device_type(type));
            }
        });*/
        document.getElementById("dev-form").reset();
        $('#add-device-form').modal("hide");
    
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
    var device = {'name': name, 'typeId':id};
    post_device(device);
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
        bind_dev_to_room(data['device'], get_current_room_id());
        //refresh_list_dev();
        $.when(create_dev(data['device'])).
        then(refresh_dev_listeners(device));
    });
}


function create_dev(device)
{   
    var list = '#'+device['typeId'];
    var dev = ' <li id="'+device['name']+'">';
    dev += '<div class="card-header" id="heading' + device['name'] + '">';
    dev += '<h4 class="mb-0">';
    dev += '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse' + device['name'] + '" aria-expanded="false" aria-controls="collapse'+ device['name'] +'">';
    dev += device['name'];
    dev += '</button>'
    dev += '</h4>';
    dev += '</div>';
    dev += '<div id="collapse' + device['name'] + '" class="collapse" aria-labelledby="heading' + device['name'] +'" data-parent="#accordionExample">';
    dev += '<div class="card-body">';
    dev += load_settings(device);
    dev += '</div></div>';
    dev += '</li>'
    
    $(list).append(dev);
    console.log("success");
    
    refresh_dev_listeners(device);

}


function refresh_dev_listeners(device)
{
    $('.blind-toggle').off().on('click', toggle_blind);
    $('.toggle').off().on('click', toggle);
    $('#lamp-' + device["id"]).off().on('input', function (para) { 
        
        lamp_slider(device["id"], this.id);
     });
     $('#oven-' + device["id"]).off().on('input', function (para) { 
        
        oven_slider(device["id"], this.id);
     });

     $('#ac-' + device["id"]).off().on('input', function (para) { 
        
        ac_slider(device["id"], this.id);
     });
}


function get_current_room_id()
{
    return sessionStorage.getItem("current_room");
}

function get_current_room_name()
{

    return sessionStorage.getItem('current_room_name');
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
    var settings = '<img class="img-responsive turned-off blind-toggle" src="./../images/switches-down.png">';
    return settings;
}


function load_lamp_settings(device)
{
    var settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
    settings += '<div class="settings">';
    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<h5>Color</h5>';
    settings += '<input class="form-control settings-form" type="color" value="#563d7c" >';
    settings += '<h5>Brightness</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="1" max="100" value="50" class="slider" id=lamp-' + device['id']+'>';
    settings += '<span id="b'+ device['id'] +'">Value</span>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    return settings;
}

function load_oven_settings(device)
{
    var settings = ' <img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
    settings += '<div class="settings">';
    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<h5>Temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="90" max="230" value="180" class="slider" id=oven-' + device['id']+'>';
    settings += '<span id="t'+ device['id'] +'">Value</span>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set heat</h5>';
    settings += '<select class="form-control settings-form" id="form-heat-' + device["id"] + '">';
    settings += '<option>conventional</option>';
    settings += '<option>bottom</option>';
    settings += '<option>top</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set Grill</h5>';
    settings += '<select class="form-control settings-form" id="form-grill-' + device["id"] + '">';
    settings += '<option>large</option>';
    settings += '<option>eco</option>';
    settings += '<option>off</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set Convection</h5>';
    settings += '<select class="form-control settings-form" id="form-convection-' + device["id"] + '">';
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
    var settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
    settings += '<div class="settings">';
    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<h5>Temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="18" max="38" value="24" class="slider" id=ac-' + device['id']+'>';
    settings += '<span id="a'+ device['id'] +'">Value</span>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set Mode</h5>';
    settings += '<select class="form-control settings-form" id="form-mode-' + device["id"] + '">';
    settings += '<option>cool</option>';
    settings += '<option>heat</option>';
    settings += '<option>fan</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set vertical swing</h5>';
    settings += '<select class="form-control settings-form" id="form-vertical-' + device["id"] + '">';
    settings += '<option>Auto</option>';
    settings += '<option>22</option>';
    settings += '<option>45</option>';
    settings += '<option>67</option>';
    settings += '<option>90</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set horizontal swing</h5>';
    settings += '<select class="form-control settings-form" id="form-horizontal-' + device["id"] + '">';
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
    settings += '<select class="form-control settings-form" id="form-speed-' + device["id"] + '">';
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

}

function load_timer_settings(device)
{

}

function load_refrigerator_settings(device)
{

}


{/* <div class="card-body">
    <img class="img-responsive turned-off toggle" src="./../images/switches-off.png">
    <div class="settings">
        <div class="row">
        <div class="col-4">
            <h5>Color</h5>
            <input class="form-control settings-form" type="color" value="#563d7c" id="lamp-color">
            <h5>Brightness</h5>
            <div class="slidecontainer">
            <input type="range" min="1" max="100" value="50" class="slider" id="lamp-brightness">
            <span id="b">Value</span>
            </div>
            <div class="form-group">
            <h5>Set heat</h5>
            <select class="form-control settings-form" id="exampleFormControlSelect1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
            </div>
        </div>
        </div>
    </div>
    </div> */}