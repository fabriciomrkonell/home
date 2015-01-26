var db = require('../models')

exports.create = function(req, res, next) {
  var user = {
    name: 'Fabrício Ronchi',
    email: 'fabricioronchii@gmail.com',
    password: 'fabricioronchii@gmail.com'
  };
  db.User.create(user).success(function(entity) {
    res.json({ success: 1 })
  });
}