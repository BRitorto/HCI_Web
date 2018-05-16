
var page_ready = false;

$(document).ready(function() 
{
    $('#lamp-brightness').on('input', lamp_slider);
    $('#oven-temperature').on('input', oven_slider);
    //$('.toggle').on('click', toggle);
    //$('.blind-toggle').on('click', toggle_blind);
});

function toggle(dev,selector)
{
    var status = ($(selector).hasClass("turned-off"))?'down': "up";
    add_one_use(dev,status);
    if ($(selector).hasClass("turned-off"))
    {
        $(selector).attr("src", "./../images/switches-on.png");
        $(selector).next().show(300);
        $(selector).attr("class",  "img-resposinve turned-on");
        var settings  = JSON.parse(dev['meta']);
        settings['status'] = 'on';
        settings['count'] = settings['count'] + 1;
        dev['meta'] = JSON.stringify(settings);
        $.ajax({
            url: base_api+'devices/'+ dev.id + "/turnOn",
            type: 'PUT',
            contentType:"application/json",
            success: function(result) {
                console.log('updated');
                
            },
            error: function(data){
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
            }
         });
    }

    else
    {
        $(selector).attr("src", "./../images/switches-off.png");
        $(selector).next().hide(300);
        $(selector).attr("class",  "img-resposinve turned-off");
        var settings  = JSON.parse(dev['meta']);
        settings['status'] = 'off';
        settings['count'] = settings['count'] + 1;
        dev['meta'] = JSON.stringify(settings);
        $.ajax({
            url: base_api+'devices/'+ dev.id + "/turnOff",
            type: 'PUT',
            contentType:"application/json",
            success: function(result) {
                console.log(result);
                console.log('updated');
            },
            error: function(data){
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
            }
         });
        
    }
}
function toggle_door(dev,selector)
{
    var status = ($(selector).hasClass("turned-off"))?'closed': "open";
    add_one_use(dev,status);
    if ($(selector).hasClass("turned-off"))
    {
        $(selector).attr("src", "./../images/switches-on.png");
        $(selector).next().show(300);
        $(selector).attr("class",  "img-resposinve turned-on");
        var settings  = JSON.parse(dev['meta']);
        settings['status'] = 'on';
        settings['count'] = settings['count'] + 1;
        dev['meta'] = JSON.stringify(settings);
        $.ajax({
            url: base_api+'devices/'+ dev.id + "/open",
            type: 'PUT',
            contentType:"application/json",
            success: function(result) {
                console.log('updated');
                
            },
            error: function(data){
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
            }
         });
    }

    else
    {
        $(selector).attr("src", "./../images/switches-off.png");
        $(selector).next().hide(300);
        $(selector).attr("class",  "img-resposinve turned-off");
        var settings  = JSON.parse(dev['meta']);
        settings['status'] = 'off';
        settings['count'] = settings['count'] + 1;
        dev['meta'] = JSON.stringify(settings);
        $.ajax({
            url: base_api+'devices/'+ dev.id + "/close",
            type: 'PUT',
            contentType:"application/json",
            success: function(result) {
                console.log(result);
                console.log('updated');
            },
            error: function(data){
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
            }
         });
        
    }
}

function toggle_blind(dev, selector)
{
    var status = ($(selector).hasClass("turned-off"))?'down': "up";
    add_one_use(dev,status);
    if ($(selector).hasClass("turned-off"))
    {
        $(selector).attr("src", "./../images/switches-up.png");
        $(selector).attr("class",  "img-resposinve turned-on blind-toggle");
        var settings  = JSON.parse(dev['meta']);
        settings['mode'] = 'up';
        //settings['count'] = settings['count'] + 1;
        dev['meta'] = JSON.stringify(settings);
        console.log(dev);
        $.ajax({
            url: base_api+'devices/'+ dev.id + "/up",
            type: 'PUT',
            contentType:"application/json",
            success: function(result) {
                console.log('updated');
            },
            error: function(data){
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
            }
         });
    }
    else
    {
        console.log($(selector));
        $(selector).attr("src", "./../images/switches-down.png");
        $(selector).attr("class",  "img-resposinve turned-off blind-toggle");
        var settings  = JSON.parse(dev['meta']);
        settings['mode'] = 'down';
        //settings['count'] = settings['count'] + 1;
        dev['meta'] = JSON.stringify(settings);
        console.log(dev);
        $.ajax({
            url: base_api+'devices/'+ dev.id + "/down",
            type: 'PUT',
            contentType:"application/json",
            success: function(result) {
                console.log('updated');
            },
            error:function(data){
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
            }
         });
    }
}

function add_one_use(device, status)
{
    var meta = JSON.parse(device.meta);
    meta['count'] = ( typeof meta['count'] != 'number')? 0: meta['count'] + 1;
    meta['status'] = status;
    console.log(meta.status + "this is status");
    var dev ={'typeId': device["typeId"], 'meta': JSON.stringify(meta), 'name': device['name']};
    console.log(device);
    $.ajax({
        url: base_api+'devices/'+ device.id ,
        type: 'PUT',
        contentType:"application/json",
        data : JSON.stringify(dev),
        success: function(result) {
            console.log(result);
        },
        error:function(data){
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
        }
     });
}

function check_page_status()
{
    return page_ready;
}

function oven_slider(dev_id, selector_id,dev)
{
    var value = $('#'+selector_id).val();
    $('#t'+dev_id).text(value);
    var settings = [value];
    $.ajax({
    url: base_api+'devices/'+ dev.id + "/setTemperature",
    type: 'PUT',
    contentType:"application/json",
    data: JSON.stringify(settings),
    success: function(result) {
        console.log('updated');
    },
    error: function(data){
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
    }
    });

} 

function lamp_slider(dev_id, selector_id,dev)
{
    var value = $('#'+selector_id).val();
    $('#b'+dev_id).text(value);
    var settings = [value];
    $.ajax({
    url: base_api+'devices/'+ dev.id + "/setBrightness",
    type: 'PUT',
    contentType:"application/json",
    data: JSON.stringify(settings),
    success: function(result) {
        console.log('updated');
    },
    error: function(data){
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
    }
    });
} 

function ac_slider(dev_id, selector_id, dev)
{
    var value = $('#'+selector_id).val();
    $('#a'+dev_id).text(value);
    var settings = [value];
    $.ajax({
    url: base_api+'devices/'+ dev.id + "/setTemperature",
    type: 'PUT',
    contentType:"application/json",
    data: JSON.stringify(settings),
    success: function(result) {
        console.log('updated');
    },
    error: function(data){
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
    }
    });
} 

function timer_slider(dev_id, selector_id, dev)
{
    var value = $('#'+selector_id).val();
    $('#c'+ dev_id).text(value + " seconds");
    var settings  = [value];
    $.ajax({
        url: base_api+'devices/'+ dev.id + "/setInterval",
        type: 'PUT',
        contentType:"application/json",
        data: JSON.stringify(settings),
        success: function(result) {
            console.log('updated');
        },
        error: function(data){
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
        }
        });
} 
function refrigerator_slider(dev_id, selector_id,dev)
{
    var value = $('#'+selector_id).val();
    $('#r'+ dev_id).text(value);
    var settings  = [value];
    $.ajax({
        url: base_api+'devices/'+ dev.id + "/setTemperature",
        type: 'PUT',
        contentType:"application/json",
        data: JSON.stringify(settings),
        success: function(result) {
            console.log('updated');
        },
        error: function(data){
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
        }
        });
} 
function freezer_slider(dev_id, selector_id,dev)
{
    var value = $('#'+selector_id).val();
    $('#f'+ dev_id).text(value);
    var settings  = [value];
    $.ajax({
        url: base_api+'devices/'+ dev.id + "/setFreezerTemperature",
        type: 'PUT',
        contentType:"application/json",
        data: JSON.stringify(settings),
        success: function(result) {
            console.log('updated');
        },
        error: function(data){
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
        }
        });
} 

function update_setting(dev, value, action)
{
    console.log(value);
    if(value == undefined)
    {   console.log("here");
        $.ajax({
            url: base_api+'devices/'+ dev.id + "/"+action,
            type: 'PUT',
            contentType:"application/json",
            success: function(result) {
                console.log(result);
                console.log('updated');
                sessionStorage.setItem('action_response',result);
            },
            error: function(data){
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
            }
        });
    }else
    {
        var settings  = [value];
        $.ajax({
            url: base_api+'devices/'+ dev.id + "/"+action,
            type: 'PUT',
            contentType:"application/json",
            data: JSON.stringify(settings),
            success: function(result) {
                console.log(result);
                console.log('updated');
                sessionStorage.setItem('action_response',result);
            },
            error: function(data){
                console.log(data);
                console.log(data['responseText']);
            }
        });
    }

    return sessionStorage.getItem('action_response');
}
