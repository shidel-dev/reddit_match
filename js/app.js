//make board collection
//board will be 4 x 6

var Card = Backbone.Model.extend({

});

var Deck = new Backbone.Collection({
    model: Card,
    seed: function(){
    $.ajax({
     type:'GET',
     url: "https://api.imgur.com/3/gallery/r/pics/top/1",
     headers:{
        'Authorization':'Client-ID ' + 'e0a49fd55972ffa'
     },
     success: function(data){card_maker(data)}
    });

    },
});

var Board = Backbone.View.extend({

  tagName: "div",

  className: "container",

  events: {
   
  },

  render: function() {
    ...
  }

});

var Card = Backbone.View.extend({

  tagName: "img",

  className: "card",

  events: {
   "click .submit": "render"
  },

  
  render: function() {
    
  }

});


var imgur_fetch = function(){
   // $.ajax({
   //   type:'GET',
   //   url: "https://api.imgur.com/3/gallery/r/pics/top/1",
   //   headers:{
   //      'Authorization':'Client-ID ' + 'e0a49fd55972ffa'
   //   },
   //   success: function(data){card_maker(data)}
   //  });
};




var card_maker = function(images){ 
   var fakeCollection = [];
   for (var i = 0; i < 12; i++){
        var card_inst = new Card({href:images.data[i].link})
        Deck.add(card_inst)
    };
   console.log(Deck.models);
};


