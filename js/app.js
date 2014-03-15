var app = {
  success:["http://31.media.tumblr.com/tumblr_m61zjnHB3o1qfw2dno1_400.gif",
               "http://25.media.tumblr.com/952f0af42c4f854875606879aa87fd3c/tumblr_mhnw8krEnm1s4zq2io1_500.gif",
               "http://whatgifs.com/wp-content/uploads/2012/03/funny-gifs-winning.gif"],

  shuffle: function (o){
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

};

app.Card = Backbone.Model.extend({
  gameLogic:function(target) {
    if (this.collection.pair.length === 0){
      this.collection.pair.push(this);
      target.firstPick();
    }else{
      this.collection.pair.push(this);
      if (this.matches(this.collection.pair)){
        if(this.collection.length === 2){
          this.collection.trigger("completeGame");
            this.collection.pair = [];
        }
        var pair = _.clone(this.collection.pair);
        this.collection.pair = [];
        this.collection.remove(pair);

      }else{
        target.secondPick(_.clone(this.collection.pair));
        this.collection.pair = [];
      }
    }  
  },

  matches:function(pair) {
    return (pair[0].attributes.imgurID === pair[1].attributes.imgurID && pair[0].cid !== pair[1].cid);
  }

});

app.Deck = Backbone.Collection.extend({
  model:app.Card,
  pair:[]
});

app.Menu = Backbone.View.extend({

  el:"#menu",
  initialize: function(){
    this.on("errorFetching",this.displayError)
    this.addListners();
  },

  addListners: function() {
    var that = this;
    this.$("#request").click(_.bind(this.submit,this));
    this.$("#subreddit").keyup(function(e) {
      if (e.keyCode == 13) {
        _.bind(that.submit,that)();
      }
    });  
  },

  submit: function() {
    new app.Board({
      model: new Backbone.Model({subreddit: this.$("#subreddit").val()}),
      collection: new app.Deck(),
      el: "#container"
    }); 
    $(this).unbind();
  },

  displayError: function(){
    this.$el.append("<p>Error fetching that subreddit...</p>");
    this.addListners();
  }
})


app.Board = Backbone.View.extend({

  initialize: function(subreddit) {
    this.collection.on("completeGame",_.bind(this.displaySuccess,this));
    this.imgurFetch();
  },

  imgurFetch: function() {
    var that = this;
    $.ajax({
      type: 'GET',
      url: "https://api.imgur.com/3/gallery/r/" + that.model.attributes.subreddit + "/top",
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
          that.render(app.shuffle(that.collection.models));
          $("#menu > p").remove();
        }else{
          app.menuInstance.trigger("errorFetching")
          $("#subreddit").val("");
        }
      },
      error: function(err){
        app.menuInstance.trigger("errorFetching")
        $("#subreddit").val("");
      }
    });

  },

  displaySuccess:function(){
    this.$el.html("<img id='a' src='" + _.sample(app.success) + "'></img>").css("display","block");
  },

  render: function(shuffColl) {
    var that = this;
    this.$el.empty()
    _(shuffColl).each(function(card) {
        that.$el.append(new app.CardView({
          model: card
        }).render().el);
    });
    return this;
  }
});

app.CardView = Backbone.View.extend({
  tagName: "span",
  model:app.Card,
  events: {
    "click": "sendAction"
  },

  initialize:function() {
    this.model.on("remove",_.bind(this.match,this));
    this.model.on("fancyBoxClose", _.bind(this.wrongPick,this));
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
    this.showImage(this.model.attributes.link,_.bind(this.triggerWrong, pair));
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
  app.menuInstance = new app.Menu();
});

