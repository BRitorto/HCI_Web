
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
            url: 'http://127.0.0.1:8080/api/devices/'+ dev.id,
            type: 'PUT',
            contentType:"application/json",
            data:JSON.stringify(dev),
            success: function(result) {
                console.log('updated');
                
            },
            error: function(data){
                console.log(data['responseText']);
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
            url: 'http://127.0.0.1:8080/api/devices/'+ dev.id,
            type: 'PUT',
            contentType:"application/json",
            data:JSON.stringify(dev),
            success: function(result) {
                console.log(result);
                console.log('updated');
            },
            error: function(data){
                console.log(data['responseText']);
            }
         });
        
    }
}

function toggle_blind(dev, selector)
{
    if ($(selector).hasClass("turned-off"))
    {
        $(selector).attr("src", "./../images/switches-up.png");
        $(selector).attr("class",  "img-resposinve turned-on blind-toggle");
        var settings  = JSON.parse(dev['meta']);
        settings['mode'] = 'up';
        settings['count'] = settings['count'] + 1;
        dev['meta'] = JSON.stringify(settings);
        console.log(dev);
        $.ajax({
            url: 'http://127.0.0.1:8080/api/devices/'+ dev.id,
            type: 'PUT',
            contentType:"application/json",
            data:JSON.stringify(dev),
            success: function(result) {
                console.log('updated');
            },
            error: function(data){
                console.log(data['responseText']);
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
        settings['count'] = settings['count'] + 1;
        dev['meta'] = JSON.stringify(settings);
        console.log(dev);
        $.ajax({
            url: 'http://127.0.0.1:8080/api/devices/'+ dev.id,
            type: 'PUT',
            contentType:"application/json",
            data: JSON.stringify(dev),
            success: function(result) {
                console.log('updated');
            },
            error: function(data){
                console.log(data['responseText']);
            }
         });
    }
}

function check_page_status()
{
    return page_ready;
}

function oven_slider(dev_id, selector_id,dev)
{
    var value = $('#'+selector_id).val();
    $('#t'+ dev_id).text(value);
    var settings  = JSON.parse(dev['meta']);
    settings['temperature'] = value;
    dev['meta'] = JSON.stringify(settings);
    $.ajax({
        url: 'http://127.0.0.1:8080/api/devices/'+ dev.id,
        type: 'PUT',
        contentType:"application/json",
        data: JSON.stringify(dev),
        success: function(result) {
            console.log('updated');
        },
        error: function(data){
            console.log(data['responseText']);
        }
        });

} 

function lamp_slider(dev_id, selector_id,dev)
{
    var value = $('#'+selector_id).val();
    $('#b'+dev_id).text(value);
    var settings  = JSON.parse(dev['meta']);
    settings['brightness'] = value;
    dev['meta'] = JSON.stringify(settings);
    $.ajax({
    url: 'http://127.0.0.1:8080/api/devices/'+ dev.id,
    type: 'PUT',
    contentType:"application/json",
    data: JSON.stringify(dev),
    success: function(result) {
        console.log('updated');
    },
    error: function(data){
        console.log(data['responseText']);
    }
    });
} 

function ac_slider(dev_id, selector_id, dev)
{
    var value = $('#'+selector_id).val();
    $('#a'+ dev_id).text(value);
    var settings  = JSON.parse(dev['meta']);
    settings['temperature'] = value;
    dev['meta'] = JSON.stringify(settings);
    $.ajax({
        url: 'http://127.0.0.1:8080/api/devices/'+ dev.id,
        type: 'PUT',
        contentType:"application/json",
        data: JSON.stringify(dev),
        success: function(result) {
            console.log('updated');
        },
        error: function(data){
            console.log(data['responseText']);
        }
    });
} 

function timer_slider(dev_id, selector_id, dev)
{
    var value = $('#'+selector_id).val();
    $('#c'+ dev_id).text(value + " seconds");
    var settings  = JSON.parse(dev['meta']);
    settings['time'] = value;
    dev['meta'] = JSON.stringify(settings);
    $.ajax({
        url: 'http://127.0.0.1:8080/api/devices/'+ dev.id,
        type: 'PUT',
        contentType:"application/json",
        data: JSON.stringify(dev),
        success: function(result) {
            console.log('updated');
        },
        error: function(data){
            console.log(data['responseText']);
        }
    });
} 
function refrigerator_slider(dev_id, selector_id,dev)
{
    var value = $('#'+selector_id).val();
    $('#r'+ dev_id).text(value);
    var settings  = JSON.parse(dev['meta']);
    settings['refrigerator'] = value;
    dev['meta'] = JSON.stringify(settings);
    $.ajax({
        url: 'http://127.0.0.1:8080/api/devices/'+ dev.id,
        type: 'PUT',
        contentType:"application/json",
        data: JSON.stringify(dev),
        success: function(result) {
            console.log('updated');
        },
        error: function(data){
            console.log(data['responseText']);
        }
    });
} 
function freezer_slider(dev_id, selector_id,dev)
{
    var value = $('#'+selector_id).val();
    $('#f'+ dev_id).text(value);
    var settings  = JSON.parse(dev['meta']);
    settings['freezer'] = value;
    dev['meta'] = JSON.stringify(settings);
    $.ajax({
        url: 'http://127.0.0.1:8080/api/devices/'+ dev.id,
        type: 'PUT',
        contentType:"application/json",
        data: JSON.stringify(dev),
        success: function(result) {
            console.log('updated');
        },
        error: function(data){
            console.log(data['responseText']);
        }
    });
} 

function update_setting(dev, key, value)
{
    var settings  = JSON.parse(dev['meta']);
    settings[key] = value;
    dev['meta'] = JSON.stringify(settings);
    $.ajax({
        url: 'http://127.0.0.1:8080/api/devices/'+ dev.id,
        type: 'PUT',
        contentType:"application/json",
        data: JSON.stringify(dev),
        success: function(result) {
            console.log('updated');
        },
        error: function(data){
            console.log(data['responseText']);
        }
    });
}
