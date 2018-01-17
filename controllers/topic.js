// Generated by CoffeeScript 1.9.3
(function() {
  var Sina, config, func_email, func_info, func_search, func_topic, func_topic_comment, func_topic_tag, func_user, moment, pagedown, safeConverter, sina;

  pagedown = require("pagedown");

  safeConverter = new pagedown.Converter();

  pagedown.Extra.init(safeConverter);

  func_topic = __F('topic');

  func_topic_comment = __F('topic_comment');

  func_info = __F('info');

  func_topic_tag = __F('topic/tag');

  func_user = __F('user');

  func_search = __F('search');

  func_email = __F('email');

  config = require('./../config.coffee');

  Sina = require("./../lib/sdk/sina.js");

  sina = new Sina(config.sdks.sina);

  moment = require('moment');

  setInterval(function() {
    return func_topic.run_sort();
  }, 1000 * 60 * 10);

  module.exports.controllers = {
    ".json": {
      get: function(req, res, next) {
        res.locals.now_page = req.query.page;
        res.send(res.locals.topics);
      }
    },
    "/": {
      get: function(req, res, next) {
        res.locals.now_page = req.query.page;
        return res.render('topic/index.jade');
      }
    },
    
    "/add": {
      get: function(req, res, next) {
        res.locals.tag_id = req.query.tag_id;
        return res.render('topic/add.jade');
      },
      post: function(req, res, next) {
        var result;
        result = {
          success: 0
        };
        req.body.html = safeConverter.makeHtml(req.body.md);
        req.body.user_id = res.locals.user.id;
        req.body.user_headpic = res.locals.user.head_pic;
        req.body.user_nick = res.locals.user.nick;
        req.body.last_comment_time = new Date();
        req.body.score = 1;
        return func_topic.add(req.body, function(error, topic) {
          if (error) {
            result.info = error.message;
          } else {
            result.success = 1;
            (__F('index')).add(topic.uuid);
            (__F('coin')).add(20, res.locals.user.id, "发布了一个话题");
            func_search.add({
              type: "topic",
              "pid": topic.uuid,
              "title": topic.title,
              "html": topic.html.replace(/<[^>]*>/g, ""),
              "udid": topic.uuid,
              "id": topic.id
            }, function() {});
            if (req.body.tag_id) {
              func_topic_tag.addCount(req.body.tag_id, 'topic_count');
            }
            (__F('create_thumbnail')).create_topic(topic.id, function() {
              return sina.statuses.upload({
                access_token: res.locals.user.weibo_token,
                pic: (require('path')).join(__dirname, "../uploads/article_thumb/topic-" + topic.id + ".png"),
                status: '我在@前端乱炖 发起了一个话题《' + topic.title + '》点击查看：http://www.html-js.com/topic/' + topic.id + "  。前端乱炖是一个专业的前端原创内容社区"
              });
            });
          }
          return res.send(result);
        });
      }
    },
    "/:id": {
      get: function(req, res, next) {
        res.locals.is_clear = req.query.is_clear;
        func_topic.addCount(req.params.id, 'visit_count', (function() {}), 2);
        if (res.locals.topic.tag_id) {
          func_topic_tag.addCount(res.locals.topic.tag_id, 'visit_count', (function() {}), 2);
        }
        return res.render('topic/topic.jade');
      }
    },
    "/:id/delete": {
      get: function(req, res, next) {
        if (res.locals.user.is_admin) {
          return func_topic["delete"](req.params.id, function(error) {
            return res.redirect('back');
          });
        } else {
          return res.redirect('back');
        }
      }
    },
    "/:id/edit": {
      get: function(req, res, next) {
        return func_topic.getById(req.params.id, function(error, topic) {
          if (error) {
            return next(error);
          } else {
            res.locals.topic = topic;
            return res.render('topic/edit.jade');
          }
        });
      },
      post: function(req, res, next) {
        var result;
        result = {
          success: 0
        };
        req.body.html = safeConverter.makeHtml(req.body.md);
        return func_topic.update(req.params.id, req.body, function(error, topic) {
          if (error) {
            result.info = error.message;
          } else {
            result.success = 1;
          }
          return res.send(result);
        });
      }
    },
    "/:id/add": {
      post: function(req, res, next) {
        var result;
        result = {
          success: 0
        };
        req.body.html = safeConverter.makeHtml(req.body.md);
        req.body.user_id = res.locals.user.id;
        req.body.user_headpic = res.locals.user.head_pic;
        req.body.user_nick = res.locals.user.nick;
        req.body.topic_id = req.params.id;
        return func_topic_comment.getLast(req.params.id, res.locals.user.id, function(error, c) {
          if (c) {
            console.log(moment(c.createdAt).valueOf());
            console.log(new Date());
            if ((new Date()).getTime() - moment(c.createdAt).valueOf() < 20000) {
              result.info = '跟帖间隔不能小于20秒';
              res.send(result);
              return;
            }
          }
          return func_topic_comment.add(req.body, function(error, comment, topic) {
            var atcount, atnames, html;
            if (error) {
              result.info = error.message;
            } else {
              result.success = 1;
              topic.updateAttributes({
                last_comment_time: new Date(),
                last_comment_user_id: res.locals.user.id,
                last_comment_user_nick: res.locals.user.nick,
                comment_count: topic.comment_count * 1 + 1
              });
              (__F('coin')).add(1, res.locals.user.id, "发布了一个话题的跟帖");
              func_info.add({
                target_user_id: topic.user_id,
                type: 5,
                source_user_id: res.locals.user.id,
                source_user_nick: res.locals.user.nick,
                time: new Date(),
                target_path: "/topic/" + topic.id,
                action_name: "【回复】了您的话题",
                target_path_name: topic.title,
                content: req.body.html
              });
              func_user.getById(topic.user_id, function(error, u) {
                if (u && u.email) {
                  return func_email.sendMessage(u.email, {
                    title: res.locals.user.nick + "回复了您发起的话题《" + topic.title + "》",
                    content: req.body.html,
                    url: "http://www.html-js.com/topic/" + topic.id
                  });
                }
              });
              if (atnames = req.body.md.match(/\@([^\s]*)/g)) {
                atcount = atnames.length;
                html = req.body.html;
                console.log(atnames);
                atnames.forEach(function(atname) {
                  atname = atname.replace("@", "");
                  return func_user.getByNick(atname, function(error, user) {
                    atcount--;
                    if (user) {
                      html = html.replace("@" + atname, "<a href='/user/" + user.id + "'>@" + atname + "</a>");
                      if (atcount === 0) {
                        func_topic_comment.update(comment.id, {
                          html: html
                        });
                      }
                      func_info.add({
                        target_user_id: user.id,
                        type: 6,
                        source_user_id: res.locals.user.id,
                        source_user_nick: res.locals.user.nick,
                        time: new Date(),
                        target_path: "/topic/" + topic.id,
                        action_name: "在回帖中【提到】了你",
                        target_path_name: topic.title,
                        content: req.body.html
                      });
                      return func_email.sendMessage(user.email, {
                        title: res.locals.user.nick + "在《" + topic.title + "》回帖中【提到】了你",
                        content: req.body.html,
                        url: "http://www.html-js.com/topic/" + topic.id
                      });
                    }
                  });
                });
              }
            }
            if (req.body.to_weibo) {
              sina.statuses.update({
                access_token: res.locals.user.weibo_token,
                status: '我在@前端乱炖 回复了话题《' + topic.title + '》' + 'http://www.html-js.com/topic/' + topic.id + " " + req.body.html.replace(/<[^>]*>/g, '').replace(/\s/g, '').substr(0, 140)
              });
            }
            return res.send(result);
          });
        });
      }
    },
    "/comment/:id/zan": {
      post: function(req, res, next) {
        func_topic_comment.addCount(req.params.id, "zan_count", function() {
          return res.send({
            success: 1
          });
        });
        if (res.locals.user) {
          return func_topic_comment.getById(req.params.id, function(error, comment) {
            return func_info.add({
              target_user_id: comment.user_id,
              type: 4,
              source_user_id: res.locals.user.id,
              source_user_nick: res.locals.user.nick,
              time: new Date(),
              target_path: "/topic/" + comment.topic_id,
              action_name: "【赞】了您的跟帖",
              target_path_name: comment.html.replace(/<.*?>/g, "")
            });
          });
        }
      }
    },
    "/:id/zan": {
      post: function(req, res, next) {
        var result;
        result = {
          success: 0
        };
        return func_topic.addZan(req.params.id, res.locals.user.id, req.body.score, function(error, log, article) {
          var data;
          if (error) {
            result.info = error.message;
          } else {
            result.success = 1;
            func_info.add({
              target_user_id: article.user_id,
              type: 1,
              source_user_id: res.locals.user.id,
              source_user_nick: res.locals.user.nick,
              time: new Date(),
              target_path: "/topic/",
              action_name: "【赞】了您发起的话题",
              target_path_name: article.title
            });
            data = {
              md: "赞了此话题！"
            };
            data.html = safeConverter.makeHtml(data.md);
            data.user_id = res.locals.user.id;
            data.user_headpic = res.locals.user.head_pic;
            data.user_nick = res.locals.user.nick;
            data.topic_id = req.params.id;
            func_topic_comment.add(data, function(error, comment, topic) {
              if (error) {
                return result.info = error.message;
              } else {
                result.success = 1;
                return topic.updateAttributes({
                  last_comment_time: new Date(),
                  last_comment_user_id: res.locals.user.id,
                  last_comment_user_nick: res.locals.user.nick,
                  comment_count: topic.comment_count * 1 + 1
                });
              }
            });
          }
          return res.send(result);
        });
      }
    }
  };

  module.exports.filters = {
    ".json": {
      get: ['topic/all-topics']
    },
    "/": {
      get: ['freshLogin', 'topic/all-tags-ifonlyone', 'topic/all-topics', 'topic/recent-replys']
    },
    
    "/add": {
      get: ['checkLogin', 'topic/all-tags'],
      post: ['checkLoginJson']
    },
    "/:id": {
      get: ['freshLogin', 'topic/get-topic', 'topic/all-comments', 'topic/sametag_topics', 'topic/favs', 'book/some-books', 'topic/topic_zan_logs']
    },
    "/:id/add": {
      post: ['checkLoginJson']
    },
    "/:id/delete": {
      get: ['checkLogin']
    },
    "/:id/zan": {
      post: ['checkLoginJson']
    },
    "/:id/edit": {
      get: ['checkLogin', 'topic/all-tags'],
      post: ['checkLoginJson']
    },
    "/comment/:id/zan": {
      post: ['freshLogin']
    }
  };

}).call(this);