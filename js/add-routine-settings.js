
var page_ready = false;
var finished = false;

$(document).ready(function() 
{
    $('#lamp-brightness').on('input', lamp_slider);
    $('#oven-temperature').on('input', oven_slider);
    //$('.toggle').on('click', toggle);
    //$('.blind-toggle').on('click', toggle_blind);
});


function get_actions(device)
{
    console.log("getteee las actoins madafaka");
    var value;
    switch(device['typeId'])
    {
        case "eu0v2xgprrhhg41g":
        {
            value = $('#form-blind-state-' + device["id"]).val();
            var index = selected_devices.findIndex(function(element){
                return element.device['id'] == device['id'];
            });
            var action = {
                'actionName': value,
                'params': null,
                'meta': null
            }
            selected_devices[index].actions.push(action);
            break;
        }

        case "go46xmbqeomjrsjr":
        {
            value =  $('#lamp-' + device["id"]).val();
            var index = selected_devices.findIndex(function(element){
                return element.device['id'] == device['id'];
            });
            var action = {
                'actionName': 'setBrightness',
                'params': value,
                'meta': {}
            }

            value = $('#form-lamp-state-' + device["id"]).val();
            
            var action = {
                'actionName': (value == "off" ? "turnOff" : "turnOn"),
                'params': null,
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-lamp-'+ device['id']).val();
            var action = {
                'actionName': "setColor",
                'params': value,
                'meta': null
            }
            selected_devices[index].actions.push(action);
            break;
        }
        case "im77xxyulpegfmv8":
        {
            value =  $('#oven-' + device["id"]).val();
            var index = selected_devices.findIndex(function(element){
                return element.device['id'] == device['id'];
            });
            var action = {
                'actionName': 'setTemperature',
                'params': [value],
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-oven-state-' + device['id']).val();

            var action = {
                'actionName': (value == "off") ? "turnOff" : "turnOn",
                'params': [],
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-heat-'+ device['id']).val();
            var action = {
                'actionName': "setHeat",
                'params': [value],
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-grill-'+ device['id']).val();
            var action = {
                'actionName': "setGrill",
                'params': [value],
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-convection-'+ device['id']).val();
            var action = {
                'actionName': "setConvection",
                'params': [value],
                'meta': null
            }
            selected_devices[index].actions.push(action);
            break;
        }
        case "li6cbv5sdlatti0j":
        {
            value =  $('#ac-' + device["id"]).val();
            var index = selected_devices.findIndex(function(element){
                return element.device['id'] == device['id'];
            });
            var action = {
                'actionName': 'setTemperature',
                'params': value,
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-ac-state-' + device["id"]).val();

            var action = {
                'actionName': (value == "off" ? "turnOff" : "turnOn"),
                'params': null,
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#ac-'+ device['id']).val();
            var action = {
                'actionName': "setTemperature",
                'params': value,
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-mode-'+ device['id']).val();
            var action = {
                'actionName': "setMode",
                'params': value,
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-vertical-'+ device['id']).val();
            var action = {
                'actionName': "setVerticalSwing",
                'params': value,
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-horizontal-'+ device['id']).val();
            var action = {
                'actionName': "setHorizontalSwing",
                'params': value,
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-speed-'+ device['id']).val();
            var action = {
                'actionName': "fanSpeed",
                'params': value,
                'meta': null
            }
            selected_devices[index].actions.push(action);
            break;
        }

            case "lsf78ly0eqrjbz91":
            {
                value = $('#form-door-state-' + device["id"]).val();
                var index = selected_devices.findIndex(function(element){
                    return element.device['id'] == device['id'];
                });
                var action = {
                    'actionName': value,
                    'params': null,
                    'meta': null
                }
                selected_devices[index].actions.push(action);
    
                value = $('#form-lock-'+ device['id']).val();
                var action = {
                    'actionName': "setMode",
                    'params': value,
                    'meta': null
                }
                selected_devices[index].actions.push(action);

                break;
        }
        case "rnizejqr2di0okho":
        {
            value =  $('#refrigerator-' + device["id"]).val();
            var index = selected_devices.findIndex(function(element){
                return element.device['id'] == device['id'];
            });
            var action = {
                'actionName': 'setTemperature',
                'params': value,
                'meta': null
            }
            value =  $('#freezer-' + device["id"]).val();

            var action = {
                'actionName': 'setFreezerTemperature',
                'params': value,
                'meta': null
            }

            selected_devices[index].actions.push(action);

            value = $('#form-refrigerator-state-' + device["id"]).val();
            var action = {
                'actionName': (value == "off" ? "open" : "close"),
                'params': null,
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-refrigerator-'+ device['id']).val();
            var action = {
                'actionName': "setTemperature",
                'params': value,
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-refrigerator-'+ device['id']).val();
            var action = {
                'actionName': "setFreezerTemperature",
                'params': value,
                'meta': null
            }
            selected_devices[index].actions.push(action);

            value = $('#form-refri-mode-'+ device['id']).val();
            var action = {
                'actionName': "setMode",
                'params': value,
                'meta': null
            }
            selected_devices[index].actions.push(action);
            
            break;
        }
    }
    
}


function check_page_status()
{
    return page_ready;
}

function oven_slider(dev_id, selector_id, dev)
{
    var value = $('#'+selector_id).val();
    $('#t'+ dev_id).text(value);
} 

function lamp_slider(dev_id, selector_id,dev)
{
    var value = $('#'+selector_id).val();
    $('#b'+dev_id).text(value);
} 

function ac_slider(dev_id, selector_id, dev)
{
    var value = $('#'+selector_id).val();
    $('#a'+ dev_id).text(value);
} 

function refrigerator_slider(dev_id, selector_id,dev)
{
    var value = $('#'+selector_id).val();
    $('#r'+ dev_id).text(value);
    
} 
function freezer_slider(dev_id, selector_id,dev)
{
    var value = $('#'+selector_id).val();
    $('#f'+ dev_id).text(value);  
} 

