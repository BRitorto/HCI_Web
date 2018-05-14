
var page_ready = false;

$(document).ready(function() 
{
    $('#lamp-brightness').on('input', lamp_slider);
    $('#oven-temperature').on('input', oven_slider);
    //$('.toggle').on('click', toggle);
    //$('.blind-toggle').on('click', toggle_blind);
});

function toggle()
{
    if ($(this).hasClass("turned-off"))
    {
        $(this).attr("src", "./../images/switches-on.png");
        $(this).next().show(300);
        $(this).attr("class",  "img-resposinve turned-on");
    }

    else
    {
        $(this).attr("src", "./../images/switches-off.png");
        $(this).next().hide(300);
        $(this).attr("class",  "img-resposinve turned-off");
        
    }
}

function toggle_blind()
{
    if ($(this).hasClass("turned-off"))
    {
        $(this).attr("src", "./../images/switches-up.png");
        $(this).attr("class",  "img-resposinve turned-on");
    }

    else
    {
        $(this).attr("src", "./../images/switches-down.png");
        $(this).attr("class",  "img-resposinve turned-off");
        
    }
}

function check_page_status()
{
    return page_ready;
}

function oven_slider(dev_id, selector_id)
{
    var value = $('#'+selector_id).val();
    $('#t'+ dev_id).text(value);
} 

function lamp_slider(dev_id, selector_id)
{
    var value = $('#'+selector_id).val();
    $('#b'+dev_id).text(value);
} 

function ac_slider(dev_id, selector_id)
{
    var value = $('#'+selector_id).val();
    $('#a'+ dev_id).text(value);
} 

function timer_slider(dev_id, selector_id)
{
    var value = $('#'+selector_id).val();
    $('#c'+ dev_id).text(value + " seconds");
} 
function refrigerator_slider(dev_id, selector_id)
{
    var value = $('#'+selector_id).val();
    $('#r'+ dev_id).text(value);
} 
function freezer_slider(dev_id, selector_id)
{
    var value = $('#'+selector_id).val();
    $('#f'+ dev_id).text(value);
} 
