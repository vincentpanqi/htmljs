// Generated by CoffeeScript 1.9.3
(function() {
  var func_question;

  func_question = __F('question');

  module.exports = function(req, res, next) {
    return func_question.count({
      user_id: res.locals.user.id
    }, function(error, _count) {
      res.locals.qa_count = _count;
      return next();
    });
  };

}).call(this);
