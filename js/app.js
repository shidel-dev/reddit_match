var Card = Backbone.Model.extend({});

var Deck = new Backbone.Collection({
    model: Card
})

var subreddit;
var fullCollection = [];
var picks = [];

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
    events: {
        "click": "gameLogic"
    },
    render: function(i) {
        this.$el.addClass(this.model.get("id"))
        this.$el.attr('id', i.toString())
        this.el.href = this.model.get("link");
        this.$el.html("<img class='card' src='img/card.png'></img>")
        return this;
    },

    gameLogic: function(e) {

        picks.push({
            class: $(e.target).parent().attr('class'),
            id: $(e.target).parent().attr('id')
        });

        if (picks.length == 2) {
            console.log(picks)
            if (picks[0].class == picks[1].class) {
                if (picks[0].id != picks[1].id) {
                    this.rightPick(picks);
                    picks = [];

                }
            } else {
                this.wrongPick(picks);
                picks = [];

            }


        } else if (picks.length == 1) {
            this.onePick();
        }
        console.log(this)
    },
    onePick: function() {
        $("#" + picks[0].id).addClass('right');
    },



    wrongPick: function(pair) {
        $("#" + pair[0].id).removeClass('right').addClass('wrong');
        $("#" + pair[1].id).fancybox({
            afterClose: function() {
                console.log(pair)
                $("#" + pair[1].id).addClass('wrong')
                setTimeout(function() {
                    $("#" + pair[0].id).removeClass('wrong');
                    $("#" + pair[1].id).removeClass('wrong');
                }, 900);

            }
        })

    },
    rightPick: function(pair) {
        var klass = "." + pair[0].class.split(' ')[1]
        $(klass).removeAttr("href");
        $(klass).children().remove()
        $(klass).unbind("click");
        $(klass).removeClass();
        $.fancybox.close();
    }

});


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

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};