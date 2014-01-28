//make board collection
//board will be 4 x 6

var Card = Backbone.Model.extend({
  type:function(){}
});

var Deck = Backbone.Collection.extend({
    model: Card
});

var Board = Backbone.View.extend({
    initialize: function() {
        console.log('ok')
        var that = this;
        this._cardViews = [];

        this.collection.each(function(donut) {
            that._cardViews.push(new CardView({
                model: Deck,
                tagName: 'img'
            }));
        });
    },
    el: $('#container')[0],


    collection: Deck
   

});

var CardView = Backbone.View.extend({


});


var imgur_fetch = function() {
    $.ajax({
        type: 'GET',
        url: "https://api.imgur.com/3/gallery/r/pics/top/1",
        headers: {
            'Authorization': 'Client-ID ' + 'e0a49fd55972ffa'
        },
        success: function(data) {
            card_maker(data)
        }
    });
};




var card_maker = function(images) {
    var tempCollection = [];
    for (var i = 0; i < 12; i++) {
        tempCollection.push(
        {href: images.data[i].link}
        )
    };
    var deck = new Deck(tempCollection);
    console.log(deck)
};