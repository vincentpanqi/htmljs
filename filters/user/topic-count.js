// Generated by CoffeeScript 1.9.3
(function() {
  var func_topic;

  func_topic = __F('topic');

  module.exports = function(req, res, next) {
    return func_topic.count({
      user_id: res.locals.user.id
    }, function(error, _count) {
      res.locals.topic_count = _count;
      return next();
    });
  };

}).call(this);
