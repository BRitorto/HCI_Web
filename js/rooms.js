var page_ready = false;


$(document).ready(function() {
    console.log( "ready!" );
    page_ready = true;
    $.when(get_rooms()).
    then($('button.edit-room').off().on('click',function (data) {
        console.log("paso");
        show_edit_room(data);
      })).
    then($('button.delete-room').off().on('click', delete_room)).
    then($('#add-room').off().on('click',show_room_form)).
    then($('.room').off().on('click', function(data){
        set_current_room(data["target"].id);
    }));
    
});


// needed for every function in this file
function check_page_status()
{
    return page_ready;
}

function show_room_form()
{
    $('#addRoom').modal();
    $('#save-button').off().on('click', add_new_room);
    //$('#save-button').on('keypress', add_new_room_handler);
    $(document).off().keypress(function(e) {
        if(e.which == 13){
            add_new_room();
            $('#addRoom').modal('toggle');
        }
    });
    document.getElementById("room-form").reset();
}


function add_new_room()
{
    if(!check_page_status)
    {
        return;
    }
    var name = $("#roomName").val();
    var room = {"name": name};
    $.post('http://127.0.0.1:8080/api/rooms/',room,function(){
        get_rooms();
    })
    $('#addRoom').modal('toggle');
    
}

function show_edit_room(room_id)
{
    $('#editRoom').modal();
    $('#save-edit-button').off().on('click', function(){
        edit_room(room_id);
        $('#editRoom').modal('toggle');
    });
    $(document).off().keypress(function(e) {
        if(e.which == 13){
            edit_room(room_id);
            $('#editRoom').modal('toggle');
        }
    });
    document.getElementById("room-form").reset();
    
    $('#editRoom').modal('toggle');
    
}

function edit_room(room_id)
{   
    var name = $("#roomNameToChange").val();
    var room = {
        "name":name
    };
    $.ajax({
        url: 'http://127.0.0.1:8080/api/rooms/'+room_id,
        type: "PUT",
        contentType:"application/json",
        data:JSON.stringify(room),
        success: function(result) {
            get_rooms();
        },
        error: function(data){
            console.log(data);
        }
    });


}

function load_rooms(rooms)
{
    if(!check_page_status)
    {
        return;
    }
    clear_displaying_rooms();
    console.log(rooms);
    rooms.forEach(room => {
        create_new_room(room);
        console.log("creating new room");
    });
    
}

function create_new_room(room)
{
    var new_dev = '<li class="list-group-item list-group-item-action" data-child='+ room['id'] +' >';

    new_dev = new_dev + '<a href="./room.html" class="room" id="' + room['id'] + '">';
    new_dev = new_dev + room['name'];
    new_dev  = new_dev + '</a>';

    new_dev = new_dev + ' <button type="button" class="btn btn-default float-right delete-room" >';
    new_dev = new_dev + '<img class= "icon" src="./../images/si-glyph-trash.svg"></img>' ;
    new_dev = new_dev + '</button>';
    new_dev = new_dev + '<button type="button" class="btn btn-default edit-room float-right" >';
    new_dev = new_dev + '<img class= "icon" src="./../images/si-glyph-pencil.svg"></img>';
    new_dev = new_dev + '</button>';
    
    new_dev =new_dev + '</li> ';
    $("#list-of-rooms").append(new_dev);

    refresh_handlers();
}


function refresh_handlers()
{
    $('.delete-room').off().on("click",delete_room);
    $('.edit-room').off().on('click',function (data) {
        show_edit_room(($(this).parent('li').data('child')));
      });
    $('.room').off().on('click', function(data){
        set_current_room(data["target"].id);
    });
}

function delete_room()
{
    $(this).closest("li").hide();
    id_value = $(this).closest("li").attr("data-child");
    $.ajax({
        url: 'http://127.0.0.1:8080/api/rooms/'+ id_value,
        type: 'DELETE',
        success: function(response) {
          console.log("delete!");
          get_rooms();
        }
     });
}


function set_current_room(room_id)
{
    console.log(room_id);
    sessionStorage.setItem("current_room",room_id );
    $.get("http://127.0.0.1:8080/api/rooms/"+ room_id,function (data){
        sessionStorage.setItem("current_room_name",data['room']["name"]);
    });
}

function get_rooms()
{
    $.getJSON( "http://127.0.0.1:8080/api/rooms", function( data ) {
    
        load_rooms(data['rooms']);
    });
}


function clear_displaying_rooms()
{
    var rooms = $("li.list-group-item").remove();

}
