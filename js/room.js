var search_arr = [];
$(document).ready(function() {
    console.log( "ready!" );
    $('#add-device-form').on('click', '#save-button', function(){
        if(validate($('#device-name').val()))    
            add_device();
        else
            alert("Name must be between 3 and 60 characters");
    });

    retrieve_device_types();
    var room_id = sessionStorage.getItem("current_room");
    $.get(base_api+"rooms/"+ room_id,function (data){
        sessionStorage.setItem("current_room_name",data['room']["name"]);
        
    }).done(function(){
        $('#current_room').text( "Room "+get_current_room_name());
    
        $('h1').text( "Room " + get_current_room_name());
        update_search_base();
    });
    
    
});

function validate(value)
{
    if(value.length < 3 || value.length > 60)
        return false;
    return true;
}



function add_device(){
    
        var type = $("#select-device-category").val(); 
        add_new_device(search_id_for_device_type(type));
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
    $.getJSON( base_api+ "devicetypes").
    done(function (data){

        data['devices'] = data['devices'].filter(e => e['name'] != "timer");

        localStorage.setItem('dev_types', JSON.stringify(data["devices"]));
        show_device_types();
        get_devices();
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
}

function get_meta_for_dev(typeId)
{
    switch(typeId){
        case "eu0v2xgprrhhg41g":
            return {'mode': 'down', 'count': 0};
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
   $.post( base_api+"devices",device).fail(function(data){
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
            alert("Something went wrong, please try again in a few minutes.");
            break;
    }
}).done(function(data){
    alert("Device added successfully!");
    bind_dev_to_room(data['device'], get_current_room_id());
    //refresh_list_dev();
    var device  = data['device'];
    $.ajax({
        url: base_api +'devices/'+ device.id + "/getState",
        type: 'PUT',
        contentType:"application/json",
        success: function(result) {
        },
        error: function(data){
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
                    alert("Something went wrong, please try again in a few minutes.");
                    break;
            }
        }
    }).done(function (result){
        var status = result['result'];
        create_dev(device,status);
    });
    });
}


function create_dev(device, status)
{   
    var list = '#'+device['typeId'];

    var name = device['name'];
    name = name.split(' ').join('-');

    var dev = ' <li id="'+device['id']+'">';
    dev += '<div class="card-header" id="heading' + name + '">';
    dev += '<h4 class="mb-0">';
    dev += '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse' + name + '" aria-expanded="false" aria-controls="collapse'+ name +'">';
    dev += device['name'];
    dev += '</button>'
    dev = dev + ' <button type="button" class="btn btn-default float-right delete-dev" >';
    dev = dev + '<img class= "icon" src="./../images/si-glyph-trash.svg"></img>' ;
    dev = dev + '</button>';
    dev = dev + '<button type="button" class="btn btn-default edit-dev float-right" >';
    dev = dev + '<img class= "icon" src="./../images/si-glyph-pencil.svg"></img>';
    dev = dev + '</button>'
    dev += '</h4>';
    dev += '</div>';
    dev += '<div id="collapse' + name + '" class="collapse" aria-labelledby="heading' + name +'" data-parent="#accordionExample">';
    dev += '<div class="card-body">';

    dev += load_settings(device,status);

    dev += '</div></div>';
    dev += '</li>'
    
    $(list).append(dev);
    
    refresh_dev_listeners(device);

}


function refresh_dev_listeners(device)
{

    $('.delete-dev').off().on("click",delete_dev);
    $('.edit-dev').off().on('click',function (data) {
        show_edit_dev($(this).closest("li").attr("id"));
      });

    switch(device['typeId']){
        case "eu0v2xgprrhhg41g":
            $('#'+device['id'] ).find('.blind-toggle').off().on('click', function (){
                toggle_blind(device, this);
            });
            
            break;
        case "go46xmbqeomjrsjr":
            $('#'+device['id'] ).find('.toggle').off().on('click', function(){
                toggle(device,this);
            });
            $('#lamp-' + device["id"]).off().on('input', function (para) { 
                
                lamp_slider(device["id"], this.id, device);
            });

            $('#form-lamp-'+ device['id']).off().change('click',function(){
                update_setting(device,$(this).val(),'setColor');
            });
            break;
        case "im77xxyulpegfmv8":
            $('#'+device['id'] ).find('.toggle').off().on('click', function(){
                toggle(device,this);
                
            });
            $('#oven-' + device["id"]).off().on('input', function (para) { 
            
                oven_slider(device["id"], this.id, device);
            });
            $('#form-heat-' + device["id"]).off().change(function (){
                update_setting(device,$(this).val(), 'setHeat');
            });
            $('#form-grill-' + device["id"]).off().change(function (){
                update_setting(device,$(this).val(),'setGrill');
            });
            $('#form-convection-' + device["id"]).off().change(function (){

                update_setting(device,$(this).val(),'setConvection');
            });

            break;

        case "li6cbv5sdlatti0j":
            $('#'+device['id'] ).find('.toggle').off().on('click', function(){
                toggle(device,this);        
            });           
            $('#ac-' + device["id"]).off().on('input', function (para) { 
                ac_slider(device["id"], this.id, device);
            });
            $('#form-mode-' + device["id"]).off().change(function (){
                update_setting(device,$(this).val(),'setMode');
            });
            $('#form-vertical-' + device["id"]).off().change(function (){
                update_setting(device,($(this).val() == 'auto')? 'auto' :parseInt($(this).val()),'setVerticalSwing');
            });
            $('#form-horizontal-' + device["id"]).off().change(function (){
                update_setting(device,($(this).val() == 'auto')? 'auto' :parseInt($(this).val()),'setHorizonatlSwing');
            });
            $('#form-speed-' + device["id"]).off().change(function (){
                update_setting(device,($(this).val() == 'auto')? 'auto' :parseInt($(this).val()),'setFanSpeed');
            });
            
            break;
    
        case "lsf78ly0eqrjbz91":
            $('#'+device['id'] ).find('.toggle').off().on('click', function(){
                toggle_door(device,this);
            });

            $('#form-lock-' + device["id"]).off().change('click',function (){

                update_setting(device,undefined,$(this).val());
            });

            $('#form-status-' + device["id"]).off().change('click',function (){
                add_one_use(device, $(this).val());
                update_setting(device,undefined,$(this).val());
            });

            
            break;
            
        case "ofglvd9gqX8yfl3l":
              
            $('#'+device['id'] ).find('.toggle').off().on('click', function(){
                toggle(device,this);
                
            });
            $('#timer-' + device["id"]).off().on('input', function (para) {    
                timer_slider(device["id"], this.id, device);
            });
            $('#form-timer-' + device["id"]).off().change('click',function (){
                if($(this).attr('value') == "off"){
                    update_setting(device,undefined,'stop');
                }else{
                    $(this).attr('value','off');
                    update_setting(device,undefined,'start');
                }
            });
            break;
        case "rnizejqr2di0okho":

            $('#refrigerator-' + device["id"]).off().on('input', function (para) { 
            
            $('.toggle').off().on('click', toggle);    
            refrigerator_slider(device["id"], this.id, device);
            });
            $('#freezer-' + device["id"]).off().on('input', function (para) { 
            
            freezer_slider(device["id"], this.id, device);
            });
            $('#form-refrigerator-' + device["id"]).off().change('click',function (){

                update_setting(device,$(this).val(),'setMode');
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

    return sessionStorage.getItem("current_room_name");
}

function bind_dev_to_room(device, room_id)
{
    $.post(base_api + "devices/"+device['id']+"/rooms/"+room_id,function(){
    } ).fail(function(data){
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
                alert("Something went wrong, please try again in a few minutes.");
                break;
        }
    });
}

function get_devices()
{

    $.get(base_api+"rooms/"+get_current_room_id()+"/devices").
    done(function (data) {
        var arr =  data['devices'];
        arr.forEach(device =>{

            $.ajax({
                url: base_api+'devices/'+ device.id + "/getState",
                type: 'PUT',
                contentType:"application/json",
                success: function(result) {
                },
                function(data){
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
                            alert("Something went wrong, please try again in a few minutes.");
                            break;
                    }
                }
            }).done(function (result){
                var status = result['result']
                create_dev(device,status);
            });

        });

      });    
}

function load_settings(device,prev_state)
{
    var type_id = device['typeId'];
    switch(type_id){
        case "eu0v2xgprrhhg41g":
            return load_blind_settings(device,prev_state);
        case "go46xmbqeomjrsjr":
            return load_lamp_settings(device,prev_state);
        case "im77xxyulpegfmv8":
            return load_oven_settings(device,prev_state);
        case "li6cbv5sdlatti0j":
            return load_ac_settings(device,prev_state);
        case "lsf78ly0eqrjbz91":
            return load_door_settings(device,prev_state);
        case "ofglvd9gqX8yfl3l":
            return load_timer_settings(device,prev_state);
        case "rnizejqr2di0okho":
            return load_refrigerator_settings(device,prev_state);
        

    } 
}



function load_blind_settings(device,status)
{

    var settings;
    if(status['status'] == "opened" || status['status'] == "opening" )
        settings = '<img class="img-resposinve turned-on blind-toggle" src="./../images/switches-up.png">';
        
   else
        settings = '<img class="img-responsive turned-off blind-toggle" src="./../images/switches-down.png">';
    return settings;
}


function load_lamp_settings(device,prev_state)
{
    var settings;
    if(prev_state['status'] == 'on')
    {
        settings = '<img class="img-resposinve turned-on toggle" src="./../images/switches-on.png">';
        settings += '<div class="settings" style="display:block">';
       
    }
    else
    {
        settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
        settings += '<div class="settings" style="display:none">';
    }
    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<h5>Color</h5>';
    settings += '<input class="form-control settings-form" type="color" id="form-lamp-'+device['id'] +'" value="'+ prev_state['color']+'" >';
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

function load_oven_settings(device,prev_state)
{
    var settings;
    if(prev_state['status'] == 'off'){
        settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
        settings += '<div class="settings" style="display:none">';
    }
    else{
        settings = '<img class="img-resposinve turned-on toggle" src="./../images/switches-on.png">';
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
    var state = (prev_state['heat']== null)? 'not setted' : prev_state['heat'];
    settings += '<h6>Current state : '+ state +'</h6>';
    settings += '<select class="form-control settings-form" id="form-heat-' + device["id"] + '">';
    settings += '<option value ="conventional" > Conventional</option>';
    settings += '<option value="bottom" >Bottom</option>';
    settings += '<option value="top" >Top</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set Grill</h5>';
    state = (prev_state['grill']== null)? 'not setted' : prev_state['grill'];
    settings += '<h6>Current state : '+ state +'</h6>';
    settings += '<select class="form-control settings-form" id="form-grill-' + device["id"] + '" value="'+prev_state['grill'] +'" ">';
    settings += '<option value="large" >Large</option>';
    settings += '<option value="eco" >Eco</option>';
    settings += '<option value="off" >Off</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set Convection</h5>';
    state  = (prev_state['convection']== null)? 'not setted' : prev_state['convection'];
    settings += '<h6>Current state : '+ state +'</h6>';
    settings += '<select class="form-control settings-form" id="form-convection-' + device["id"] + '" value="'+prev_state['convection'] +'" ">';
    settings += '<option value="normal" >Normal</option>';
    settings += '<option value="eco" >Eco</option>';
    settings += '<option value="off" >Off</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';

    return settings;
    
}

function load_ac_settings(device,prev_state)
{
    var settings;
    if(prev_state['status'] == 'off'){
        settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
        settings += '<div class="settings" style="display:none">';
    }
    else{
        settings = '<img class="img-resposinve turned-on toggle" src="./../images/switches-on.png">';
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
    var state = (prev_state['mode']== null)? 'not setted' : prev_state['mode'];
    settings += '<h6>Current state : '+ state +'</h6>';
    settings += '<select class="form-control settings-form" id="form-mode-' + device["id"] + '" value="'+prev_state['mode'] +'" ">';
    settings += '<option value="cool" >Cool</option>';
    settings += '<option value="heat" >Heat</option>';
    settings += '<option value="fan" >Fan</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set vertical swing</h5>';
    state = (prev_state['verticalSwing']== null)? 'not setted' : prev_state['verticalSwing'];
    settings += '<h6>Current state : '+ state +'</h6>';
    settings += '<select class="form-control settings-form" id="form-vertical-' + device["id"] + '" value="'+prev_state['vertical_swing'] +'" ">';
    settings += '<option value="auto">Auto</option>';
    settings += '<option value="22" >22</option>';
    settings += '<option value="45" >45</option>';
    settings += '<option value="67" >67</option>';
    settings += '<option value="90" >90</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set horizontal swing</h5>';
    state = (prev_state['horizontalSwing']== null)? 'not setted' : prev_state['horizontalSwing'];
    settings += '<h6>Current state : '+ state +'</h6>';
    settings += '<select class="form-control settings-form" id="form-horizontal-' + device["id"] + '" value="'+prev_state['horizontal_swing'] +'" ">';
    settings += '<option>Auto</option>';
    settings += '<option value="-90">- 90</option>';
    settings += '<option value="-45">- 45</option>';
    settings += '<option value="0">0</option>';
    settings += '<option value="45">45</option>';
    settings += '<option value="90">90</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set fan speed</h5>';
    state = (prev_state['fanSpeed']== null)? 'not setted' : prev_state['fanSpeed']
    settings += '<h6>Current state : '+ state +'</h6>';
    settings += '<select class="form-control settings-form" id="form-speed-' + device["id"] + '" value="'+prev_state['fan'] +'" ">';
    settings += '<option value="auto">Auto</option>';
    settings += '<option value ="25">25</option>';
    settings += '<option value="50">50</option>';
    settings += '<option value="75">75</option>';
    settings += '<option value="100">100</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    return settings;
}


function load_door_settings(device,prev_state)
{
    var settings;
    settings += '<div class="form-group">';
    settings += '<h5>Set status</h5>';
    state = (prev_state['status']== null)? 'not setted' : prev_state['status'];
    settings += '<h6>Current state : '+ state +'</h6>';
    settings += '<select class="form-control settings-form" id="form-status-' + device["id"] + '"  value="'+ prev_state['status']+ '">';
    settings += '<option value ="open">Open</option>';
    settings += '<option value="close">Close</option>';
    settings += '</select>';
    settings += '</div>';
    // if(prev_state['status'] == 'closed'){
    //     settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
    //     settings += '<div class="settings" style="display:none">';
    // }
    // else{
    //     settings = '<img class="img-resposinve turned-on toggle" src="./../images/switches-on.png">';
    //     settings += '<div class="settings" style="display:block">';
    // }
    settings += '<div class="settings" style="display:block">';
    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<div class="form-group">';
    settings += '<h5>Set lock</h5>';
    state = (prev_state['lock']== null)? 'not setted' : prev_state['lock'];
    settings += '<h6>Current state : '+ state +'</h6>';
    settings += '<select class="form-control settings-form" id="form-lock-' + device["id"] + '"  value="'+ prev_state['lock']+ '">';
    settings += '<option value ="lock">Lock</option>';
    settings += '<option value="unlock">Unlock</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    return settings;
}

function load_timer_settings(device,prev_state)
{   
    var settings;
    if(prev_state['status'] == 'off'){
        settings = '<img class="img-responsive turned-off toggle" src="./../images/switches-off.png">';
        settings += '<div class="settings" style="display:none">';
    }
    else{
        settings = '<img class="img-resposinve turned-on toggle" src="./../images/switches-on.png">';
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
    var state = (prev_state['status']== null)? 'not setted' : prev_state['status'];
    settings += '<h6>Current state : '+ state +'</h6>';
    settings += '<select class="form-control settings-form" id="form-timer-' + device["id"] + '" value="'+ prev_state['status'] +'">';
    settings += '<option value="start">Start</option>';
    settings += '<option value="stop">Stop</option>';
    settings += '</select>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    settings += '</div>';
    return settings;
}

function load_refrigerator_settings(device,prev_state)
{
    var settings;
    settings = '<img class="img-resposinve turned-on toggle" src="./../images/switches-on.png">';
    settings += '<div class="settings" style="display:block">';

    settings += '<div class="row">';
    settings += '<div class="col-4">';
    settings += '<h5>set freezer temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="-20" max="-10" value="'+ prev_state['freezerTemperature']+ '" class="slider" id=freezer-' + device['id']+' >';
    settings += '<span id="f'+ device['id'] +'">' + prev_state['freezerTemperature']+ '</span>';
    settings += '</div>';
    settings += '<h5>set refrigerator temperature</h5>';
    settings += '<div class="slidecontainer">';
    settings += '<input type="range" min="2" max="8" value="' + prev_state['temperature']+ '" class="slider" id=refrigerator-' + device['id']+'>';
    settings += '<span id="r'+ device['id'] +'">' + prev_state['temperature']+ '</span>';
    settings += '</div>';
    settings += '<div class="form-group">';
    settings += '<h5>Set Mode</h5>';
    var state = (prev_state['mode']== null)? 'not setted' : prev_state['mode']
    settings += '<h6>Current state : '+ state +'</h6>';
    settings += '<select class="form-control settings-form" id="form-refrigerator-' + device["id"] + '" value="'+ prev_state['mode']+'">';
    settings += '<option value="default">Default</option>';
    settings += '<option value="vacation">Vacations</option>';
    settings += '<option value="party">Party</option>';
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

function get_device_state(device)
{ 
    $.ajax({
        url: base_api+'devices/'+ device.id + "/getState",
        type: 'PUT',
        contentType:"application/json",
        success: function(result) {
        },
        error: function(data){
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
                    alert("Something went wrong, please try again in a few minutes.");
                    break;
            }
        }
    }).done(function (result){
        var settings = load_settings(device, result['result']);
        sessionStorage.setItem('action_response',settings)
        
    });

    return sessionStorage.getItem('action_response');
}



function update_dev(device,key, value)
{
    device[key] = value;
    $.ajax({
        url: base_api+'devices/'+ device.id ,
        type: 'PUT',
        contentType:"application/json",
        data: device,
        success: function(result) {
        },
        error: function(data){
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
                    alert("Something went wrong, please try again in a few minutes.");
                    break;
            }
        }
    });
}


function delete_dev()
{
    $(this).closest("li").hide();
    id_value = $(this).closest("li").attr("id");
    $.ajax({
        url: base_api+'devices/'+ id_value,
        type: 'DELETE',
        contentType:"application/json",
        success: function(result) {
        },
        error: function(data){
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
                    alert("Something went wrong, please try again in a few minutes.");
                    break;
            }
        }
    });
}

function show_edit_dev(dev_id)
{
    $('#editDevice').modal();
    $('#save-edit-button').off().on('click', function(){
        if(validate($('#devNameToChange').val()))    
            edit_dev(dev_id);
        else
            alert("Name must be between 3 and 60 characters");
    
        $('#editDevice').modal('toggle');
    });
    document.getElementById("dev-form").reset();
    
    $('#editDevice').modal('toggle');
    
}

function edit_dev(dev_id)
{
    var name = $("#devNameToChange").val();
    $.get(base_api+'devices/'+dev_id).done(
        function(response){

            var dev = {
                "name":name,
                "typeId":response['device']['typeId'],
                "meta": response['device']['meta']
            };
            $.ajax({
                url: base_api+"devices/"+dev_id,
                type: "PUT",
                contentType:"application/json",
                data:JSON.stringify(dev),
                success: function(result) {
                    location.reload();
                },
                error: function(data){
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
                            alert("Something went wrong, please try again in a few minutes.");
                            break;
                    }
                }
            });

    });

    
}


function update_search_base()
{
    $.getJSON( base_api+"rooms").done(function(response){
        response['rooms'].forEach(room=>{
            var value =  {'type':'room', 'id':room.id, 'name':room.name};
            search_arr.push(value);
            $.getJSON( base_api+"rooms/"+room.id+'/devices').done(function(response){
                response['devices'].forEach(dev=>{
                    var device = {'type':'device', 'id':dev.id, 'room':room.id, 'name':dev.name};
                    search_arr.push(device)
                });
            });
        });
        
        

    });
}



function updateResult(query) {

    
    var resultList = $('#result-list');
    $('.result-li').remove();
    if(query.length == 0){
        return;
    }
    search_arr.map(function(algo){

        query.split(" ").map(function (word){
            if(algo.name.toLowerCase().indexOf(word.toLowerCase()) != -1){

                resultList.append('<li class="list-group-item result-li"><a href="room.html" class="result_link" data-result="'+ algo.id +'">'+algo.name+'</a></li>');

            }

        });

    });

    $('.result_link').off().on('click',function(){
        var id = $(this).attr('data-result')
        var element = get_element_searched(id);
        if(element.type == 'room'){
            set_current_room(element.id);
        }else{
            set_current_room(element.room);
        }
            
    });

}

function get_element_searched(id)
{
    var found;
    search_arr.forEach(element =>{
        if(element.id == id)
            found = element;
    });
    return found;
}

function set_current_room(room_id)
{
    sessionStorage.setItem("test", room_id);
    sessionStorage.setItem("current_room",room_id );
    $.get(base_api+"rooms/"+ room_id,function (data){
        sessionStorage.setItem("current_room_name",data['room']["name"]);
    });
}