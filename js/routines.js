var page_ready = false;


$(document).ready(function() {
    console.log( "ready!" );
    page_ready = true;

    $.getJSON( "http://127.0.0.1:8080/api/routines").done(function(data) {
        load_routines(data['routines']);
        $('.routine').off().on('click', function(data){
            set_current_routine(data["target"].id);
        });
        $('button.delete-routine').on('click', delete_routine);
        });
    });



function delete_routine()
{
    $(this).closest("li").hide();
    var id_value = $(this).closest("li").attr("data-child");
    $.ajax({
        url: 'http://127.0.0.1:8080/api/routines/'+ id_value,
        type: 'DELETE',
        success: function(response) {
          console.log("delete!");
          get_routines();
        }
     });
}

function set_current_routine(routine_id)
{
    console.log(routine_id);
    sessionStorage.setItem("current_routine",routine_id );
    $.get("http://127.0.0.1:8080/api/routines/"+ routine_id,function (data){
        sessionStorage.setItem("current_routine_name",data['routine']["id"]);
    });
}

// needed for every function in this file
function check_page_status()
{
    return page_ready;
}

function get_routines()
{
    $.getJSON( "http://127.0.0.1:8080/api/routines", function( data ) {
        load_routines(data['routines']);
    });
}

function clear_displaying_routines()
{
    var routines = $("li.list-group-item").remove();
}


function load_routines(routines)
{
    if(!check_page_status)
    {
        return;
    }
    clear_displaying_routines();
    console.log(routines);
    routines.forEach(routine => {
        create_new_routine(routine);
        console.log("creating new routine");
    });
    
}

function create_new_routine(routine)
{
    var new_dev = '<li class="list-group-item list-group-item-action" data-child='+ routine['id'] +' >';

    new_dev = new_dev + '<a href="./routine.html" class="routine" id="' + routine['id'] + '">';
    new_dev = new_dev + routine['name'];
    new_dev  = new_dev + '</a>';

    new_dev = new_dev + ' <button type="button" class="btn btn-default float-right delete-routine">';
    new_dev = new_dev + '<img class= "icon" src="./../images/si-glyph-trash.svg"></img>' ;
    new_dev = new_dev + '</button>';
    
    new_dev =new_dev + '</li> ';
    $("#list-of-routines").append(new_dev);
}

function refresh_handlers()
{
    $('.delete-routine').off().on("click",delete_routine);
    $('.routine').off().on('click', function(data){
        set_current_routine(data["target"].id);
    });
}
