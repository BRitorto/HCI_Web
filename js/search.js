var search_arr = [];
$(document).ready(function() {
    console.log( "ready!" );
   
    update_search_base();
    
    
});

function update_search_base()
{
    $.getJSON( base_api+"rooms").done(function(response){
        response['rooms'].forEach(room=>{
            var value =  {'type':'room', 'id':room.id, 'name':room.name};
            search_arr.push(value);
            $.getJSON( base_api+"rooms/"+room.id+'/devices').done(function(response){
                response['devices'].forEach(dev=>{
                    var device = {'type':'device', 'id':dev.id, 'room':room.id, 'name':dev.name};
                    search_arr.push(device)
                });
            });
        });
        
        

    });
}


function updateResult(query) {

    
    var resultList = $('#result-list');
    $('.result-li').remove();
    search_arr.map(function(algo){

        query.split(" ").map(function (word){
            console.log(algo);
            if(algo.name.toLowerCase().indexOf(word.toLowerCase()) != -1){

                resultList.append('<li class="list-group-item result-li"><a href="room.html" class="result_link" data-result="'+ algo.id +'">'+algo.name+'</a></li>');

            }

        });

    });

    $('.result_link').off().on('click',function(){
        var id = $(this).attr('data-result')
        var element = get_element_searched(id);
        if(element.type == 'room'){
            set_current_room(element.id);
        }else{
            set_current_room(element.room);
        }
            
    });

}

function get_element_searched(id)
{
    var found;
    search_arr.forEach(element =>{
        if(element.id == id)
            found = element;
    });
    return found;
}

function set_current_room(room_id)
{
    console.log(room_id);
    sessionStorage.setItem("test", room_id);
    sessionStorage.setItem("current_room",room_id );
    $.get(base_api+"rooms/"+ room_id,function (data){
        sessionStorage.setItem("current_room_name",data['room']["name"]);
    });
}