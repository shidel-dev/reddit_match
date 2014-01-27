var Card = Backbone.Model.extend({

});






var reddit_fetch = function(){
   $.ajax({
     type:'GET',
     url: "https://api.imgur.com/3/gallery/r/pics/top/1",
     headers:{
        'Authorization':'Client-ID ' + 'e0a49fd55972ffa'
     },
     success: function(data){

        console.log(data)
     }
    });
}

