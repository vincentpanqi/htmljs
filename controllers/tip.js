// Generated by CoffeeScript 1.9.3
(function() {
  var Sina, config, func_article, func_comment, func_email, func_user, moment, sina, tip_func;

  tip_func = __F("tip");

  func_article = __F('article/article');

  moment = require('moment');

  func_user = __F('user');

  moment.lang('zh-cn');

  config = require('./../config.coffee');

  Sina = require("./../lib/sdk/sina.js");

  sina = new Sina(config.sdks.sina);

  func_comment = __F('comment');

  func_email = __F('email');

  module.exports.controllers = {
    "/add": {
      post: function(req, res, next) {
        req.body.user_id = res.locals.user.id;
        req.body.user_nick = res.locals.user.nick;
        req.body.user_headpic = res.locals.user.head_pic;
        return tip_func.getAll(1, 10, {
          target_id: req.body.target_id,
          parent_id: null,
          user_id: req.body.user_id
        }, function(error, tips_for_count) {
          if ((!req.body.parent_id) && tips_for_count.length > 4) {
            return res.send({
              code: 100
            });
          } else {
            return tip_func.add(req.body, function(error, tip) {
              var data;
              res.send(tip);
              if (!req.body.parent_id) {
                data = {
                  md: '添加了一枚【评注】:' + req.body.content
                };
                data.html = '添加了一枚【评注】:' + req.body.content;
                data.user_id = res.locals.user.id;
                data.user_headpic = res.locals.user.head_pic;
                data.user_nick = res.locals.user.nick;
                data.target_id = "article_" + req.body.target_id;
                return func_comment.add(data, function(error, comment, topic) {
                  func_article.addCount(req.body.target_id, "comment_count");
                  return func_article.getById(req.body.target_id, function(error, article) {
                    if (article && tips_for_count.length <= 2) {
                      return func_user.getById(article.user_id, function(error, user) {
                        return func_email.sendMessage(user.email, {
                          title: res.locals.user.nick + " 为您的原创文章《" + article.title + "》添加了一条评注",
                          content: req.body.content,
                          url: "http://www.html-js.com/article/" + req.body.target_id
                        });
                      });
                    }
                  });
                });
              }
            });
          }
        });
      }
    },
    "/:id": {
      get: function(req, res, next) {
        return tip_func.getById(req.params.id, function(error, tip) {
          var tips;
          tips = [tip];
          return tip_func.getAll(1, 30, {
            parent_id: req.params.id
          }, "id asc", function(error, ts) {
            if (ts) {
              tips = tips.concat(ts);
            }
            if (tips && tips.length) {
              tips.forEach(function(_tip) {
                if (_tip) {
                  return _tip.dataValues.time = moment(_tip.createdAt).fromNow();
                }
              });
            }
            return res.send(tips);
          });
        });
      }
    },
    "/p/:id": {
      get: function(req, res, next) {
        return tip_func.getAllByTargetId(req.params.id, function(error, tips) {
          return res.send(tips);
        });
      }
    }
  };

  module.exports.filters = {
    "/add": {
      post: ["checkLoginJson"]
    }
  };

}).call(this);
