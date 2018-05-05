$(document).ready(function() {
    console.log( "ready!" );

    $('#add-device').on('click', addDevice);
    $('#add-room').on('click', addRoom);

    function addRoom(){
        $('#addRoomFromMain').modal();
    }

    function addDevice(){
        $('#addDeviceFromMain').modal();
    }

});