var Card = Backbone.Model.extend({});

var Deck = new Backbone.Collection({
    model: Card
})

var DeckClone = new Backbone.Collection({
    model: Card
})

var subreddit;

var Board = Backbone.View.extend({

    initialize: function() {
        this.imgurFetch();
    },

    imgurFetch: function() {
        var that = this;
        console.log(this.subreddit)
        $.ajax({
            type: 'GET',
            url: "https://api.imgur.com/3/gallery/r/"+subreddit+"/top",
            headers: {
                'Authorization': 'Client-ID ' + 'e0a49fd55972ffa'
            },
            success: function(res) {
                that.collection.add(res.data.slice(0, 12))
                that.render();
                that.render();
            }
        });

    },

    render: function() {
        var that = this;
        var htmlCollection = []
        this.collection.each(function(card) {
            if (card.attributes.link != undefined) {
                var thisCardView = new CardView({
                    model: card
                });
                htmlCollection.push(thisCardView.render().el);
            }
        })
        shuffleCollection = shuffle(htmlCollection);
        console.log(shuffleCollection)
        _(shuffleCollection).each(function(card) {
            $(that.el).append(card);
        })
        return this;
    }
});

var CardView = Backbone.View.extend({
    tagName: "a",
    className: 'fancybox',
    render: function() {
        // console.log(this)
        this.el.href = this.model.get("link");
        this.$el.html("<img src='img/card.png'></img>")
        return this;
    }
});



// console.log(b.collection)

$(document).ready(function() {
    $(".fancybox").fancybox();
    $("#request").click(function() {
        subreddit = $('#subreddit').val()
        var b = new Board({
            collection: Deck,
            el: "#container"
            
        })
    })

});




function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};