$(document).ready(function() {
    console.log( "ready!" );

    $('#add-room').on('click', addRoom);

    function addRoom(){
        $('#addRoom').modal();
    }

});