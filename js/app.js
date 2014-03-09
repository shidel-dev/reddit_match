var Card = Backbone.Model.extend({
  gameLogic:function(target) {
    var pair = this.collection.pair;
    if (pair.length < 1){
      pair.push(this);
      target.firstPick();
    }else{
      pair.push(this);
      if (this.matches(pair)){
        this.collection.remove(pair);
        pair.length = 0;
      }else{
        target.secondPick(_.clone(pair));
        pair.length = 0;
      }
    }  
  },

  matches:function(pair) {
    return (pair[0].attributes.imgurID === pair[1].attributes.imgurID && pair[0].cid !== pair[1].cid);
  }

});

var Deck = Backbone.Collection.extend({
  model:Card,
  pair:[]
});


var Board = Backbone.View.extend({

  initialize: function() {
    var that = this;
    $("#request").click(function() {
      that.imgurFetch();
      $(this).unbind();
    });
    $("#subreddit").keyup(function(e) {
      if (e.keyCode == 13) {
        that.imgurFetch();
        $(this).unbind();
      }
    });
    
  },

  imgurFetch: function() {
    var subreddit = $("#subreddit").val(),
        that = this;
    $.ajax({
      type: 'GET',
      url: "https://api.imgur.com/3/gallery/r/" + subreddit + "/top",
      headers: {
        'Authorization': 'Client-ID e0a49fd55972ffa'
      },
      success: function(res) {
        if(res.data.length){
          var trimedObj = _.map(res.data.slice(0, 12), function(image) {
            return {link: image.link, imgurID: image.id};
          });
          that.collection.add(trimedObj);
          that.collection.add(trimedObj);
          window.test = that.render(shuffle(that.collection));
          $("#menu > p").remove();
        }else{
          that.initialize();
          $("#menu").append("<p>Error fetching that subreddit...</p>");
          $("#subreddit").val("")
        }
      },
      error: function(err){
        that.initialize();
        $("#menu").append("<p>Error fetching that subreddit...</p>");
        $("#subreddit").val("")
      }
    });

  },

  render: function(shuffColl) {
    var that = this;
    _(shuffColl.models).each(function(card) {
        $(that.el).append(new CardView({
          model: card
        }).render().el);
    });
    return this;
  }
});

var CardView = Backbone.View.extend({
  tagName: "span",
  events: {
    "click": "sendAction"
  },

  initialize:function() {
    this.model.on("remove",this.match.bind(this));
    this.model.on("fancyBoxClose", this.wrongPick.bind(this));
  },

  render: function() {
    this.$el.html("<img class='card' src='img/card.png'></img>");
    return this;
  },

  sendAction: function() {
    this.model.gameLogic(this);
  },

  firstPick: function() {
    this.$el.addClass("right");
    this.showImage(this.model.attributes.link, undefined);
  },

  secondPick: function(pair) {
    this.showImage(this.model.attributes.link,this.triggerWrong.bind(pair));
  },

  triggerWrong: function() {
    this[0].trigger("fancyBoxClose");
    this[1].trigger("fancyBoxClose");
  },

  wrongPick: function() {
    this.$el.attr("class","wrong");
    var that = this;
    setTimeout(function() {
      that.$el.removeClass("wrong");
    },500);
  },

  match:function() { 
    this.$el.children("img").remove();
    this.$el.attr("class","");
  },

  showImage:function(imageHref,callback){
    $.fancybox.open({
      href: imageHref,
      afterClose:callback
    });
  }

});

$(function() {
  new Board({
    collection: new Deck(),
    el: "#container",
  });
});

var success = ["http://31.media.tumblr.com/tumblr_m61zjnHB3o1qfw2dno1_400.gif",
               "http://25.media.tumblr.com/952f0af42c4f854875606879aa87fd3c/tumblr_mhnw8krEnm1s4zq2io1_500.gif",
               "http://whatgifs.com/wp-content/uploads/2012/03/funny-gifs-winning.gif"];

function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}



// -- shim for function.prototype.bind to be on the safe side!-- 
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var aArgs = Array.prototype.slice.call(arguments, 1), 
    fToBind = this, 
    fNOP = function () {},
    fBound = function () {
      return fToBind.apply(this instanceof fNOP && oThis
       ? this
       : oThis,
       aArgs.concat(Array.prototype.slice.call(arguments)));
    };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}