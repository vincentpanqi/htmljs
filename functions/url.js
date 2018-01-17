// Generated by CoffeeScript 1.9.3
(function() {
  var UUS, Urls, func;

  Urls = new __BaseModel('urls');

  func = new __BaseFunction(Urls);

  UUS = new __BaseModel('uus');

  UUS.sync();

  Urls.sync();

  func.addUUS = function(data) {
    return UUS.create(data);
  };

  func.getUUSById = function(id, callback) {
    return UUS.find({
      where: {
        id: id
      }
    }).success(function(uus) {
      return callback(null, uus);
    }).error(function(e) {
      return callback(e);
    });
  };

  func.getByPath = function(path, callback) {
    return Urls.find({
      where: {
        path: path
      }
    }).success(function(u) {
      return callback(null, u);
    }).error(function(e) {
      return callback(e);
    });
  };

  func.getByKey = function(key, callback) {
    return Urls.find({
      where: {
        key: key
      }
    }).success(function(u) {
      return callback(null, u);
    }).error(function(e) {
      return callback(e);
    });
  };

  module.exports = func;

}).call(this);
