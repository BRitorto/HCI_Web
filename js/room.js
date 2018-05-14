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
    var device = {'name': name, 'typeId':id, 'meta':JSON.stringify(get_meta_for_dev(id))};
    post_device(device);
    console.log("finished");
}

function get_meta_for_dev(typeId)
{
    switch(typeId){
        case "eu0v2xgprrhhg41g":
            return {'mode': 'down'};
        case "go46xmbqeomjrsjr":
            return {'status':'off','color':'#563d7c', 'brightness':'50'};
        case "im77xxyulpegfmv8":
            return {'status':'off', 'temperature':'180','heat':'conventional','grill':'large','convection':'normal'};
        case "li6cbv5sdlatti0j":
            return {'status':'off','temperature':'24','mode':'cool','vertical_swing':'auto','horizontal_swing':'auto','fan':'auto'};
        case "lsf78ly0eqrjbz91":
            return {'status':'close','lock':'off'};
        case "ofglvd9gqX8yfl3l":
            return {'status':'off','time':'0'};
        case "rnizejqr2di0okho":
            return {'status':'off','freezer':'-10','refrigerator':'4','mode':'default'};
        
    }
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
    console.log(JSON.stringify(device));
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
    var dev = ' <li id="'+device['id']+'">';
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

    switch(device['typeId']){
        case "eu0v2xgprrhhg41g":
            $('.blind-toggle').off().on('click', function (){
                toggle_blind(device, this);
                console.log('blind' + device);
            });
            
            break;
        case "go46xmbqeomjrsjr":
            $('#'+device['id'] ).find('.toggle').off().on('click', function(){
                toggle(device,this);
                console.log('lamp' + device);
            });
            $('#lamp-' + device["id"]).off().on('input', function (para) { 

                lamp_slider(device["id"], this.id, device);
                
            });
            break;
        case "im77xxyulpegfmv8":
            $('#'+device['id'] ).find('.toggle').off().on('click', function(){
                toggle(device,this);
                console.log('oven' + device);
            });
            $('#oven-' + device["id"]).off().on('input', function (para) { 
            
                oven_slider(device["id"], this.id, device);
            });
            $('#form-heat-' + device["id"]).off().change('click',function (){

                update_setting(device,'heat',$('#form-heat-' + device["id"]).val());
            });
            $('#form-grill-' + device["id"]).off().change('click',function (){

                update_setting(device,'grill',$('#form-grill-' + device["id"]).val());
            });
            $('#form-convection-' + device["id"]).off().change('click',function (){

                update_setting(device,'convection',$('#form-convection-' + device["id"]).val());
            });

            break;

        case "li6cbv5sdlatti0j":
            $('.toggle').off().on('click', function(){
                toggle(device,this);
            });            
            $('#ac-' + device["id"]).off().on('input', function (para) { 
                ac_slider(device["id"], this.id, device);
            });
            $('#form-mode-' + device["id"]).off().change('click',function (){

                update_setting(device,'mode',$('#form-mode-' + device["id"]).val());
            });
            $('#form-vertical-' + device["id"]).off().change('click',function (){

                update_setting(device,'vertical_swing',$('#form-vertical-' + device["id"]).val());
            });
            $('#form-horizontal-' + device["id"]).off().change('click',function (){

                update_setting(device,'horizontal_swing',$('#form-horizontal-' + device["id"]).val());
            });
            $('#form-speed-' + device["id"]).off().change('click',function (){

                update_setting(device,'fan',$('#form-speed-' + device["id"]).val());
            });
            
            break;
    
        case "lsf78ly0eqrjbz91":
            $('.toggle').off().on('click', function(){
                toggle(device,this);
            });
            
            break;
            
        case "ofglvd9gqX8yfl3l":
              
            $('.toggle').off().on('click', function(){
                toggle(device,this);
            }); 
            $('#timer-' + device["id"]).off().on('input', function (para) {    
                timer_slider(device["id"], this.id, device);
            });
            $('#form-timer-' + device["id"]).off().change('click',function (){

                update_setting(device,'time',$('#form-timer-' + device["id"]).val());
            });
            break;
        case "rnizejqr2di0okho":
            $('.toggle').off().on('click', function(){
                toggle(device,this);
            });
            $('#refrigerator-' + device["id"]).off().on('input', function (para) { 
            
            $('.toggle').off().on('click', toggle);    
            refrigerator_slider(device["id"], this.id, device);
            });
            $('#freezer-' + device["id"]).off().on('input', function (para) { 
            
            freezer_slider(device["id"], this.id, device);
            });
            $('#form-refrigerator-' + device["id"]).off().change('click',function (){

                update_setting(device,'mode',$('#form-refrigerator-' + device["id"]).val());
            });
            break;
        
    }

    
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

    var settings;
    var status = convert_to_json(device['meta']);
    if(status['mode'] == "down")
        settings = '<img class="img-responsive turned-off blind-toggle" src="./../images/switches-down.png">';
   else
        settings = '<img class="img-resposinve turned-on blind-toggle" src="./../images/switches-up.png">';
    return settings;
}


function load_lamp_settings(device)
{
    var settings;
    var prev_state = convert_to_json(device['meta']);
    if(prev_state['status'] == 'off'){
        settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
        settings += '<div class="settings" style="display:none">';
    }
    else{
        settings = '<img class="img-resposinve turned-on" src="./../images/switches-on.png">';
        settings += '<div class="settings" style="display:block">';
    }
    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<h5>Color</h5>';
    settings += '<input class="form-control settings-form" type="color" value="'+ prev_state['color']+'" >';
    settings += '<h5>Brightness</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="1" max="100" value="'+prev_state['brightness'] +'" class="slider" id=lamp-' + device['id']+'>';
    settings += '<span id="b'+ device['id'] +'">'+prev_state['brightness'] +'</span>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    return settings;
}

function load_oven_settings(device)
{
    var settings;
    var prev_state = convert_to_json(device['meta']);
    if(prev_state['status'] == 'off'){
        settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
        settings += '<div class="settings" style="display:none">';
    }
    else{
        settings = '<img class="img-resposinve turned-on" src="./../images/switches-on.png">';
        settings += '<div class="settings" style="display:block">';
    }

    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<h5>Temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="90" max="230" value="'+ prev_state['temperature']+'" class="slider" id=oven-' + device['id']+'>';
    settings += '<span id="t'+ device['id'] +'">'+ prev_state['temperature']+'</span>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set heat</h5>';
    settings += '<select class="form-control settings-form" id="form-heat-' + device["id"] + '" value="'+prev_state['heat'] +'" ">';
    settings += '<option>conventional</option>';
    settings += '<option>bottom</option>';
    settings += '<option>top</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set Grill</h5>';
    settings += '<select class="form-control settings-form" id="form-grill-' + device["id"] + '" value="'+prev_state['grill'] +'" ">';
    settings += '<option>large</option>';
    settings += '<option>eco</option>';
    settings += '<option>off</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set Convection</h5>';
    settings += '<select class="form-control settings-form" id="form-convection-' + device["id"] + '" value="'+prev_state['convection'] +'" ">';
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
    var settings;
    var prev_state = convert_to_json(device['meta']);
    if(prev_state['status'] == 'off'){
        settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
        settings += '<div class="settings" style="display:none">';
    }
    else{
        settings = '<img class="img-resposinve turned-on" src="./../images/switches-on.png">';
        settings += '<div class="settings" style="display:block">';
    }
    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<h5>Temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="18" max="38" value="'+ prev_state['temperature']+'" class="slider" id=ac-' + device['id']+'>';
    settings += '<span id="a'+ device['id'] +'">'+ prev_state['temperature']+'</span>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set Mode</h5>';
    settings += '<select class="form-control settings-form" id="form-mode-' + device["id"] + '" value="'+prev_state['mode'] +'" ">';
    settings += '<option>cool</option>';
    settings += '<option>heat</option>';
    settings += '<option>fan</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set vertical swing</h5>';
    settings += '<select class="form-control settings-form" id="form-vertical-' + device["id"] + '" value="'+prev_state['vertical_swing'] +'" ">';
    settings += '<option>Auto</option>';
    settings += '<option>22</option>';
    settings += '<option>45</option>';
    settings += '<option>67</option>';
    settings += '<option>90</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set horizontal swing</h5>';
    settings += '<select class="form-control settings-form" id="form-horizontal-' + device["id"] + '" value="'+prev_state['horizontal_swing'] +'" ">';
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
    settings += '<select class="form-control settings-form" id="form-speed-' + device["id"] + '" value="'+prev_state['fan'] +'" ">';
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
    var settings;
    var prev_state = convert_to_json(device['meta']);
    if(prev_state['status'] == 'off'){
        settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
        settings += '<div class="settings" style="display:none">';
    }
    else{
        settings = '<img class="img-resposinve turned-on" src="./../images/switches-on.png">';
        settings += '<div class="settings" style="display:block">';
    }
    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<div class="form-group">';
    settings += '<h5>Set lock</h5>';
    settings += '<select class="form-control settings-form" id="form-lock-' + device["id"] + '"  value="'+ prev_state['lock']+ '">';
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
    var settings;
    var prev_state = convert_to_json(device['meta']);
    if(prev_state['status'] == 'off'){
        settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
        settings += '<div class="settings" style="display:none">';
    }
    else{
        settings = '<img class="img-resposinve turned-on" src="./../images/switches-on.png">';
        settings += '<div class="settings" style="display:block">';
    }
    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<h5>Time</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="0" max="21474836" value="'+ prev_state['time'] +'" class="slider" id=timer-' + device['id']+'>';
    settings += '<span id="c'+ device['id'] +'">'+ prev_state['time'] +'</span>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set Alarm</h5>';
    settings += '<select class="form-control settings-form" id="form-timer-' + device["id"] + '" value="'+ prev_state['status'] +'">';
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
    var settings;
    var prev_state = convert_to_json(device['meta']);
    if(prev_state['status'] == 'off'){
        settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
        settings += '<div class="settings" style="display:none">';
    }
    else{
        settings = '<img class="img-resposinve turned-on" src="./../images/switches-on.png">';
        settings += '<div class="settings" style="display:block">';
    }
    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<h5>set freezer temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="-20" max="-10" value="'+ prev_state['freezer']+ '" class="slider" id=freezer-' + device['id']+' >';
    settings += '<span id="f'+ device['id'] +'">' + prev_state['freezer']+ '</span>';
    settings += '</div>';
    settings += '<h5>set refrigerator temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="2" max="8" value="' + prev_state['refrigerator']+ '" class="slider" id=refrigerator-' + device['id']+'>';
    settings += '<span id="r'+ device['id'] +'">' + prev_state['refrigerator']+ '</span>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set Mode</h5>';
    settings += '<select class="form-control settings-form" id="form-refrigerator-' + device["id"] + '" value="'+ prev_state['mode']+'">';
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




function convert_to_json(json_string) 
{ 
    return JSON.parse(json_string);
}