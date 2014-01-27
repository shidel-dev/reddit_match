//make board collection
//board will be 4 x 6

var Card = Backbone.Model.extend({

});






var imgur_fetch = function(){
   $.ajax({
     type:'GET',
     url: "https://api.imgur.com/3/gallery/r/pics/top/1",
     headers:{
        'Authorization':'Client-ID ' + 'e0a49fd55972ffa'
     },
     success: function(data){card_maker(data)}
    });
};




var card_maker = function(images){ 
   var fakeCollection = [];
   for (var i = 0; i < images.data.length; i++){
        console.log(images.data[i].link);
   };

   console.log(fakeCollection);

   
};

