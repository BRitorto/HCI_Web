$(document).ready(function() {
    console.log( "ready!" );
    
    $('#add-device').on('click', addDevice);
    $.when(getDeviceTypes()).then(show_device_types());
    
    

});



function addDevice(){
    $('#addDevice').modal();
}



function getDeviceTypes()
{
    $.getJSON( "http://127.0.0.1:8080/api/devicetypes", function( data ) {
    
        //console.log(data["devices"]);
        localStorage.setItem('dev_types', JSON.stringify(data["devices"]));
    });
}

function refresh_device_types(name)
{
    
    $('#selectDeviceCategory').append('<option>'+ name +'</option>')
}

function show_device_types()
{
    //var data = localStorage.getItem('dev_types');
    data  = JSON.parse(localStorage.getItem('dev_types'));
    data.forEach(element => {
        if(element["name"]!= "alarm"){
            create_new_type(element);
            refresh_device_types(get_dev_type_name(element));
        }
       
    });
    
}

function create_new_type(element)
{
    var new_dev = '<a class="custom-pills nav-link" id="'+ element['id'] + '-tab" data-toggle="pill" href="#'+element['id'] +'" role="tab" aria-controls="v-pills-profile" aria-selected="false">';
    new_dev = new_dev + get_dev_type_name(element);
    new_dev = new_dev + '</a>';
    $('#v-pills-tab').append(new_dev);

    var new_acordion = '<div class="tab-pane fade show" id="'+ element['id'] +'" role="tabpanel" aria-labelledby="'+ element['id']+'-tab">';
    new_acordion = new_acordion + '<div class="accordion" id="room'+ element['name'] + '" data-parent="#selector">';
    new_acordion = new_acordion + '<div class="secondary-card card">';
    new_acordion = new_acordion + '</div></div></div>';
    $('#v-pills-tabContent').append(new_acordion);

}



function get_dev_type_name(element){
    switch(element['name']){
        case 'blind': 
            return 'Blinds';
        case 'lamp':
            return 'Lamps';
        case 'oven':
            return 'Ovens';
        case 'ac':
            return 'Air Conditioners';
        case 'door':
            return 'Doors';
        case 'alarm':
            return 'Alarms';
        case 'timer':
            return 'Timers';
        case 'refrigerator':
            return 'Refrigerators';
        
    }
}


function select_device_type()
{

}

