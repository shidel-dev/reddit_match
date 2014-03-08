var Card = Backbone.Model.extend({
  gameLogic:function(){
    this.collection.remove(this)
  }
});

var Deck = Backbone.Collection.extend({
  model: Card,
  pair:[]
})


var subreddit;
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
        'Authorization': 'Client-ID e0a49fd55972ffa'
      },
      success: function(res) {
        var trimedObj = _.map(res.data.slice(0, 12), function(image) {
          return {link: image.link, imgurID: image.id}
        })
        that.collection.add(trimedObj);
        that.collection.add(trimedObj);
        window.test = that.render(shuffle(that.collection));
      }
    });

  },

  render: function(shuffColl) {
    var that = this;
    _(shuffColl.models).each(function(card, i) {
      if (card.attributes.link != undefined) {
        var thisCardView = new CardView({
          model: card
        });
        shuffColl[i] = (thisCardView.render(i).el);
      }
    })
    _(shuffColl).each(function(card) {
      $(that.el).append(card);
    })
    return this;
  }
});

var CardView = Backbone.View.extend({
  tagName: "span",
  events: {
    "click": "sendAction"
  },

  initialize:function(){
    this.model.on("remove",this.clearCard)
  },

  render: function(i) {
    this.$el.addClass(this.model.get("imgurID"))
    this.el.id = this.model.get("link");
    this.$el.html("<img class='card' src='img/card.png'></img>")
    return this;
  },

  sendAction: function(args){
    this.model.gameLogic()
  },

  clearCard:function(){
    debugger;
  }


});


$(document).ready(function() {
  $(".fancybox").fancybox();
  $("#request").click(loadUrls)
  $("#subreddit").keyup(function(e) {
    if (e.keyCode == 13) {
      loadUrls()
    }
  });

});
var success = ["http://31.media.tumblr.com/tumblr_m61zjnHB3o1qfw2dno1_400.gif",
"http://25.media.tumblr.com/952f0af42c4f854875606879aa87fd3c/tumblr_mhnw8krEnm1s4zq2io1_500.gif",
"http://whatgifs.com/wp-content/uploads/2012/03/funny-gifs-winning.gif"
]

var loadUrls = _.once(createBoard)

function createBoard() {
  subreddit = $('#subreddit').val()
  var b = new Board({
    collection: new Deck,
    el: "#container"
  })
}

function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};