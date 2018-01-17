// Generated by CoffeeScript 1.9.3
(function() {
  var Sina, config, func_cloudmail, func_comment, func_job, func_resume, pagedown, safeConverter, sina;

  func_job = __F('job/job');

  func_resume = __F('job/resume');

  func_comment = __F('job/comment');

  func_cloudmail = __F('cloudmail');

  pagedown = require("pagedown-htmljs");

  safeConverter = new pagedown.Converter();

  pagedown.Extra.init(safeConverter);

  config = require('./../config.coffee');

  Sina = require("./../lib/sdk/sina.js");

  sina = new Sina(config.sdks.sina);

  module.exports.controllers = {
    "/": {
      get: function(req, res, next) {
        return res.render('job/list');
      }
    },
    "/add": {
      get: function(req, res, next) {
        return res.render('job/add');
      },
      post: function(req, res, next) {
        return func_job.add(req.body, function(error, job) {
          if (error) {
            return next(error);
          } else {
            return res.redirect('/job');
          }
        });
      }
    },
    "/:id": {
      get: function(req, res, next) {
        func_job.addCount(req.params.id, "visit_count", function(error) {});
        return res.render('job/job');
      }
    },
    "/:id/zan": {
      post: function(req, res, next) {
        var result;
        result = {
          success: 0,
          info: ""
        };
        return func_job.addZan(req.params.id, res.locals.user.id, function(error) {
          if (error) {
            result.info = error.message;
            return res.send(result);
          } else {
            result.success = 1;
            return res.send(result);
          }
        });
      }
    },
    "/:id/update": {
      get: function(req, res, next) {
        var result;
        result = {
          success: 0,
          info: ""
        };
        return func_job.update(req.params.id, req.query, function(error) {
          if (error) {
            return next(error);
          } else {
            return res.redirect('back');
          }
        });
      }
    },
    "/:id/create_mail": {
      get: function(req, res, next) {
        return func_cloudmail.addLocalEmail(req.query.source, req.query.target, req.query.user_id, function(error) {
          if (!error) {
            func_job.update(req.query.job_id, {
              email: req.query.target
            }, function(error) {});
          }
          return res.redirect("back");
        });
      }
    },
    "/:id/add": {
      post: function(req, res, next) {
        req.body.html = safeConverter.makeHtml(req.body.md);
        req.body.user_id = res.locals.user.id;
        req.body.user_headpic = res.locals.user.head_pic;
        req.body.user_nick = res.locals.user.nick;
        req.body.job_id = req.params.id;
        return func_comment.add(req.body, function(error, commment) {
          if (error) {
            return res.send({
              success: 0,
              info: error.message
            });
          } else {
            return res.send({
              success: 1
            });
          }
        });
      }
    },
    "/:id/edit": {
      get: function(req, res, next) {
        return func_job.getById(req.params.id, function(error, job) {
          if (error) {
            return next(error);
          } else {
            res.locals.job = job;
            return res.render('job/add');
          }
        });
      },
      post: function(req, res, next) {
        return func_job.update(req.params.id, req.body, function(error) {
          return res.redirect('job/' + req.params.id);
        });
      }
    },
    "/resume/add": {
      get: function(req, res, next) {
        return res.render('job/add-resume');
      },
      post: function(req, res, next) {
        return func_resume.add(req.body, function(error, resume) {
          if (error) {
            return next(error);
          } else {
            return res.redirect('/job');
          }
        });
      }
    },
    "/resume/edit/:id": {
      get: function(req, res, next) {
        return func_resume.getById(req.params.id, function(error, resume) {
          if (error) {
            return next(error);
          } else {
            res.locals.resume = resume;
            return res.render('job/add-resume');
          }
        });
      }
    }
  };

  module.exports.filters = {
    "/": {
      get: ['freshLogin', 'job/all-publish-jobs', 'job/check-resume', 'job/jian_jobs']
    },
    "/add": {
      get: ['checkLogin']
    },
    "/:id": {
      get: ['freshLogin', "job/comments", "job/get-job", "job/his-jobs", "job/city-jobs", "job/has_zan", "job/zan-logs"]
    },
    "/:id/zan": {
      post: ['checkLoginJson']
    },
    "/:id/update": {
      get: ['checkLogin']
    },
    "/:id/add": {
      post: ['checkLogin']
    },
    "/:id/edit": {
      get: ['checkLogin'],
      post: ['checkLogin']
    },
    "/resume/add": {
      get: ['checkLogin']
    },
    "/resume/edit/:id": {
      get: ["checkLogin"]
    }
  };

}).call(this);
