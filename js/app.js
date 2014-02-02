var Card = Backbone.Model.extend({});

var Deck = new Backbone.Collection({
    model: Card
})

var subreddit;
var fullCollection = [];

var Board = Backbone.View.extend({

    initialize: function() {
        this.imgurFetch();
    },

    imgurFetch: function() {
        var that = this;
        console.log(this.subreddit)
        $.ajax({
            type: 'GET',
            url: "https://api.imgur.com/3/gallery/r/" + subreddit + "/top",
            headers: {
                'Authorization': 'Client-ID ' + 'e0a49fd55972ffa'
            },
            success: function(res) {
                that.collection.add(res.data.slice(0, 12))
                fullCollection = doubleShuffle(that);
                that.render();
                gameLogic();
            }
        });

    },

    render: function() {
        var that = this;
        var htmlCollection = []
        _(fullCollection).each(function(card, i) {
            if (card.attributes.link != undefined) {
                var thisCardView = new CardView({
                    model: card
                });
                htmlCollection.push(thisCardView.render(i).el);
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
        this.$el.addClass(this.model.get("id"))
        this.el.href = this.model.get("link");
        this.$el.html("<img id='card' src='img/card.png'></img>")
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

function doubleShuffle(elem) {
    fullCollection.push(elem.collection.models)
    fullCollection.push(elem.collection.models)
    return shuffle(_.flatten(fullCollection))
};

function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function gameLogic() {

    var picks = [];
    $('.fancybox').click(function(e) {
        picks.push($(e.target).parent().attr('class'));
        if (picks.length == 2) {
            console.log(picks)
            if (picks[0] == picks[1]) {
                var klass = "." + picks[0].split(' ')[1]
                $(klass).children().hide()
            }
            picks = []
        }
    })

}