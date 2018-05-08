var page_ready = false;

var rooms = [
];

$(document).ready(function() {
    console.log( "ready!" );
    page_ready = true;
    get_rooms();
    $('#add-room').on('click', show_room_form);
    $('.delete-room').on('click', delete_room);

});


// needed for every function in this file
function check_page_status()
{
    return page_ready;
}

function show_room_form()
{
    $('#addRoom').modal();
    $('#save-button').on('click', add_new_room);
    //$('#save-button').on('keypress', add_new_room_handler);
    $(document).keypress(function(e) {
        if(e.which == 13){
            add_new_room();
            $('#addRoom').modal('toggle');
            $(document).off('keypress');
        }
    })

    document.getElementById("room-form").reset();

}


function add_new_room()
{
    if(!check_page_status)
    {
        return;
    }
    var name = $("#roomName").val();
    var room = {'name': name};
    rooms.push(room);
    create_new_room(room);
    $('#addRoom').modal('toggle');
}


function load_rooms()
{
    if(!check_page_status)
    {
        return;
    }
    console.log(rooms);
    rooms.forEach(room => {
        create_new_room(room);
        console.log("creating new room");
    });
}

function create_new_room(room)
{
    var new_dev = '<li class="list-group-item list-group-item-action" id="' + room['id'] + '">';

    new_dev = new_dev + '<a href="./room.html">';
    new_dev = new_dev + room['name'];
    new_dev  = new_dev + '</a>';

    new_dev = new_dev + ' <button type="button" class="btn btn-default float-right delete-room" >';
    new_dev = new_dev + '<img class= "icon" src="./../images/si-glyph-trash.svg"/>' ;
    new_dev = new_dev + '</button>';
    new_dev = new_dev + '<button type="button" class="btn btn-default float-right">';
    new_dev = new_dev + '<img class= "icon" src="./../images/si-glyph-pencil.svg"/>';
    new_dev = new_dev + '</button>';
    
    new_dev =new_dev + '</li> ';
    $("#list-of-rooms").append(new_dev);

    refresh_handlers();
}


function refresh_handlers()
{
    $('.delete-room').off("click",delete_room);
    $('.delete-room').on('click', delete_room);
}

function delete_room()
{
    $(this).closest("li").hide();
    value = $(this).closest("div .row").attr("id");
    rooms = rooms.filter(item => item['id'] != value);
}




function get_rooms()
{
    $.getJSON( "http://127.0.0.1:8080/api/rooms", function( data ) {
    
        load_rooms1(data['rooms']);
    });
}

function load_rooms1(rooms)
{
    if(!check_page_status)
    {
        return;
    }
    rooms.forEach(room => {
        create_new_room(room);
        console.log("creating new room");
    });
}