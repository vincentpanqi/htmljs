// Generated by CoffeeScript 1.9.3
(function() {
  var func_topic;

  func_topic = __F('topic');

  module.exports = function(req, res, next) {
    return func_topic.getZansByTopicId(req.params.id, function(error, zan_logs) {
      res.locals.zan_logs = zan_logs;
      res.locals.zan_guo = false;
      if (zan_logs && res.locals.user) {
        zan_logs.forEach(function(log) {
          if (log.user_id === res.locals.user.id) {
            return res.locals.has_zan = true;
          }
        });
      }
      return next();
    });
  };

}).call(this);
