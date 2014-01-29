//make board collection
//board will be 4 x 6

var Card = Backbone.Model.extend({
    tagName: 'img'
});

var Deck = Backbone.Collection.extend({
    el: '#container',
    model: Card,

    render: function() {
        $el.append("<p>ok</p>")
    },

});

var Board = Backbone.View.extend({
    initialize: function() {
        $.ajax({
            type: 'GET',
            url: "https://api.imgur.com/3/gallery/r/pics/top/1",
            headers: {
                'Authorization': 'Client-ID ' + 'e0a49fd55972ffa'
            },
            success: function(res) {
                var d = new Deck(res.data.slice(0, 12))
                console.log(d)
            }
        });
    },

    collection: Deck


});

var CardView = Backbone.View.extend({


});

