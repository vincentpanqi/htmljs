// Generated by CoffeeScript 1.9.3
(function() {
  var func_fav;

  func_fav = __F('user/fav');

  module.exports = function(req, res, next) {
    return func_fav.getByUUID(res.locals.article.uuid, function(error, favs) {
      res.locals.favs = favs;
      return next();
    });
  };

}).call(this);
