// Generated by CoffeeScript 1.9.3
(function() {
  var func_allcount;

  func_allcount = {
    data: {
      card: 0,
      user: 0,
      article: 0,
      column: 0,
      question: 0,
      topic: 0
    },
    last_check: 0,
    init: function() {
      this.last_check = new Date().getTime();
      (__F('card')).count(null, function(error, count) {
        return func_allcount.data.card = count;
      });
      (__F('user')).count(null, function(error, count) {
        return func_allcount.data.user = count;
      });
      (__F('article/article')).count(null, function(error, count) {
        return func_allcount.data.article = count;
      });
      (__F('column')).count(null, function(error, count) {
        return func_allcount.data.column = count;
      });
      (__F('question')).count(null, function(error, count) {
        return func_allcount.data.question = count;
      });
      return (__F('topic')).count(null, function(error, count) {
        return func_allcount.data.topic = count;
      });
    },
    check: function(name) {
      return (__F(name)).count(null, function(error, count) {
        return func_allcount.data[name] = count;
      });
    },
    getData: function() {
      var now;
      now = new Date().getTime();
      if (now - this.last_check > 1000 * 60 * 60) {
        this.init();
      }
      return this.data;
    }
  };

  func_allcount.init();

  module.exports = func_allcount;

}).call(this);
