var db = require('../models')

exports.find = function(req, res, next) {
  db.Arduino.find({ where: { id: req.param('id') } }).success(function(entity) {
    res.json(entity)
  });
}

exports.findAll = function(req, res, next) {
  db.Arduino.findAll().success(function(entities) {
    res.json(entities)
  });
}

exports.persist = function(req, res, next) {
  db.Arduino.find({ where: { id: req.param('id') } }).success(function(entity) {
    if(entity){
      entity.description = req.body.description;
      entity.labelOn = req.body.labelOn;
      entity.labelOff = req.body.labelOff;
      entity.pin = req.body.pin;
      entity.updateAttributes(entity).success(function(_entity) {
        res.json(_entity)
      })
    }else{
      req.body.status = 0;
      db.Arduino.create(req.body).success(function(_entity) {
        res.json({ error: 0, message: "Salvo com sucesso!" })
      });
    }
  });
}

exports.toogleStatus = function(pin, status) {
  db.Arduino.find({ where: { pin: pin } }).success(function(entity) {
    entity.status = status;
    entity.updateAttributes(entity);
  });
}

exports.delete = function(req, res, next) {
  db.Arduino.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.send(204)
      })
    } else {
      res.send(404)
    }
  })
}