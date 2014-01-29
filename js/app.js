var Card = Backbone.Model.extend({});

var Deck = new Backbone.Collection({
    model: Card
})

var Board = Backbone.View.extend({

    initialize:function(){
        this.imgurFetch();
    },

    imgurFetch: function() {
        var that = this;
        $.ajax({
            type: 'GET',
            url: "https://api.imgur.com/3/gallery/r/pics/top/1",
            headers: {
                'Authorization': 'Client-ID ' + 'e0a49fd55972ffa'
            },
            success: function(res) {
                that.collection.add(res.data.slice(0, 11))
                that.render();
            }
        });
        // function scope(col){console.log(col)}
    },

    render: function() {
        var that = this;
        this.collection.each(function(card) {
            if(card.attributes.link != undefined) {
                // console.log(card.attributes.link)
                var thisCardView = new CardView({model: card});
                $(that.el).append(thisCardView.render().el);
            }
        })
        return this;
    }
});

var CardView = Backbone.View.extend({
    tagName: "img",
render: function() {
        console.log(this)
        this.el.src = this.model.get("link");
        return this;
    }
});

var b = new Board({
    collection: Deck,
    el: "#container"
})
// b.render();

// console.log(Deck)

// Deck.each(function(model){
//    console.log(model.attributes.link) 
// })
