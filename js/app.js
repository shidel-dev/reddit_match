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
        "click":"gameLogic"
    },
    render: function(i) {
        this.$el.addClass(this.model.get("id"))
        this.$el.attr('id', i.toString())
        this.el.href = this.model.get("link");
        this.$el.html("<img class='card' src='img/card.png'></img>")
        return this;
    },
    picks:[],
    gameLogic:function(e){
        this.picks.push({
            class: $(e.target).parent().attr('class'),
            id: $(e.target).parent().attr('id')
        });

        if (this.picks.length == 2) {
            console.log(this.picks)
            if (this.picks[0].class == this.picks[1].class) {
                if (this.picks[0].id != this.picks[1].id) {
                    rightPick(this.picks)
                }
            } else {
                wrongPick(this.picks)
            }
            this.picks = []
        } else if (this.picks.length == 1) {
            onePick(this.picks);
        }
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

// function gameLogic() {

//     var picks = [];
//     $('.fancybox').click(function(e) {
        
//     })

// };



function onePick(picks) {
    $("#" + picks[0].id).addClass('right');
}

function wrongPick(picks) {
    $("#" + picks[0].id).removeClass('right').addClass('wrong');
    $("#" + picks[1].id).fancybox({
        afterClose: function() {
            $("#" + picks[1].id).addClass('wrong')
            setTimeout(function() {
                $("#" + picks[0].id).removeClass('wrong');
                $("#" + picks[1].id).removeClass('wrong');
            }, 900);

        }
    })
};

function rightPick(picks) {
    var klass = "." + picks[0].class.split(' ')[1]
    $(klass).removeAttr("href");
    $(klass).children().remove()
    $(klass).unbind("click");
    $(klass).removeClass();
    $.fancybox.close();
}