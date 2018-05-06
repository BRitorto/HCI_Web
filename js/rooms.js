var page_ready = false;

var rooms = [
    {'name':'prueba'}

];

$(document).ready(function() {
    console.log( "ready!" );
    page_ready = true;
    load_rooms();

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

    rooms.forEach(room => {
        create_new_room(room);
        console.log("creating new room");
    });
}

function create_new_room(room)
{
    var new_dev = '<a href="#" class="list-group-item list-group-item-action">';
    new_dev = new_dev + room['name'];
    new_dev = new_dev + ' <button type="button" class="btn btn-default float-right">';
    new_dev = new_dev + '<img class= "icon" src="./../images/si-glyph-trash.svg"/>' ;
    new_dev = new_dev + '</button>';
    new_dev = new_dev + '<button type="button" class="btn btn-default float-right">';
    new_dev = new_dev + '<img class= "icon" src="./../images/si-glyph-pencil.svg"/>';
    new_dev = new_dev + '</button>';
    new_dev  = new_dev + '</a>';
    $("#list-of-rooms").append(new_dev);
    
}


function delete_room()
{
 console.log("pressed"); 
 $(this).closest("div .row").hide();

}
