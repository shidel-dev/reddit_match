var Card = Backbone.Model.extend({});

var Deck = Backbone.Collection.extend({
    model:Card
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
        $.ajax({
            type: 'GET',
            url: "https://api.imgur.com/3/gallery/r/" + subreddit + "/top",
            headers: {
                'Authorization': 'Client-ID ' + 'e0a49fd55972ffa'
            },
            success: function(res) {

                var trimedObj = _.map(res.data.slice(0, 12),function(image){
                   return  {link:image.link, imgurID:image.id}
                })
        
                that.collection.add(trimedObj);
                
                that.collection.add(trimedObj);
                
                that.render(shuffle(that.collection));
            }
        });

    },

    render: function(shuffColl) {
        console.log(shuffColl)
        var that = this;
        var htmlCollection = []
        _(shuffColl.models).each(function(card, i) {
            if (card.attributes.link != undefined) {
                var thisCardView = new CardView({
                    model: card
                });
                htmlCollection.push(thisCardView.render(i).el);
            }
        })
        _(htmlCollection).each(function(card) {
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
        this.$el.addClass(this.model.get("ImgurID"))
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
    },
    onePick: function() {
        $("#" + picks[0].id).addClass('right');
    },



    wrongPick: function(pair) {
        $("#" + pair[0].id).removeClass('right').addClass('wrong');
        $("#" + pair[1].id).fancybox({
            afterClose: function() {
                $("#" + pair[1].id).addClass('wrong')
                setTimeout(function() {
                    $("#" + pair[0].id).removeClass('wrong');
                    $("#" + pair[1].id).removeClass('wrong');
                }, 900);

            }
        })

    },
    rightPick: function(pair) {
        var klass = $("." + pair[0].class.split(' ')[1])
        klass.removeAttr("href");
        klass.children().remove()
        klass.unbind("click");
        klass.removeClass();
        $.fancybox.close();
        if ($(".fancybox").length == 0) {
            $("#container").html("<img id='a' src='" + _.sample(success) + "'></img>").css("display","block")
        }
    }

});


$(document).ready(function() {
    $(".fancybox").fancybox();
    $("#request").click(function() {
        subreddit = $('#subreddit').val()
        var b = new Board({
            collection: new Deck,
            el: "#container"

        })
    })

});
var success = ["http://31.media.tumblr.com/tumblr_m61zjnHB3o1qfw2dno1_400.gif",
    "http://25.media.tumblr.com/952f0af42c4f854875606879aa87fd3c/tumblr_mhnw8krEnm1s4zq2io1_500.gif",
    "http://whatgifs.com/wp-content/uploads/2012/03/funny-gifs-winning.gif"
]



function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};