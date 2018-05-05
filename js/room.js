$(document).ready(function() {
    console.log( "ready!" );
    
    $('#add-device').on('click', addDevice);

    function addDevice(){
        $('#addDevice').modal();
    }

});