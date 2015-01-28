var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io'),
    io = io.listen(http),
    net = require('net')
    tcpServer = net.createServer(),
    cors = require('cors'),
    url = require('url'),
    sys = require(process.binding('natives').util ? 'util' : 'sys'),
    bodyParser     = require('body-parser'),
    errorHandler   = require('errorhandler'),
    methodOverride = require('method-override'),
    path = require('path'),
    db = require('./models'),
    passport = require('passport'),
    flash = require('connect-flash'),
    LocalStrategy = require('passport-local').Strategy,
    user = require('./routes/user'),
    arduino = require('./routes/arduino'),
    task = require('./routes/task'),
    site = require('./routes/site'),
    listArduinos = [],
    listClients = [],
    time = '';

app.set('port', process.env.PORT || 3000)
app.use(cors());
app.use(bodyParser())
app.use(express.static(path.join(__dirname, 'app')))

app.configure(function() {
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'home' }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

function findById(id, fn) {
  db.User.find({ where: { id: id } }).success(function(entity) {
    if (entity) {
      fn(null, entity);
    } else {
      fn(new Error(id));
    }
  });
}

function findByUsername(username, fn) {
  db.User.find({ where: { email: username } }).success(function(entity) {
    if (entity) {
      return fn(null, entity);
    } else {
      return fn(null, null);
    }
  });
}

function naoAutenticado(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send({ error: 1 });
}

function naoAutenticadoHome(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      findByUsername(username, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user == null) {
          return done(null, null);
        }
        return done(null, user);
      })
    });
  }
));

app.get('/', function(req, res, next){
  res.sendfile('public/index.html', { user: req.user, message: req.flash('error') });
});

app.get('/home', naoAutenticadoHome, function(req, res, next){
  res.sendfile('app/home.html', { user: req.user });
});

app.get('/error', function(req, res, next){
  res.json({ success: 0 });
});

app.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/error', failureFlash: true }),
  function(req, res, next) {
    res.json({ success: 1 });
});

app.get('/views/home/:page', naoAutenticado, function(req, res, next){
  res.sendfile('app/views/home/index.html', { user: req.user });
});

app.get('/views/arduino/:page', naoAutenticado, function(req, res, next){
  res.sendfile('app/views/arduino/index.html', { user: req.user });
});

app.get('/views/arduino/new/:page', naoAutenticado, function(req, res, next){
  res.sendfile('app/views/arduino/new/index.html', { user: req.user });
});

app.get('/views/task/:page', naoAutenticado, function(req, res, next){
  res.sendfile('app/views/task/index.html', { user: req.user });
});

app.get('/views/task/new/:page', naoAutenticado, function(req, res, next){
  res.sendfile('app/views/task/new/index.html', { user: req.user });
});

app.get('/init', user.create)
app.get('/arduino', naoAutenticado, arduino.findAll)
app.get('/arduino/:id', naoAutenticado, arduino.find)
app.get('/real-time', naoAutenticado, site.realTime)
app.get('/task', task.findAll)

app.post('/arduino', naoAutenticado, arduino.persist)
app.post('/task', naoAutenticado, task.persist)
app.post('/task/toogle/:id', naoAutenticado, task.toogleRepeat)

app.del('/arduino/:id', naoAutenticado, arduino.delete)
app.del('/task/:id', naoAutenticado, task.delete)

if ('development' === app.get('env')) {
  app.use(errorHandler())
}

function toogle(message, client, status){

  arduino.toogleStatus(message.pin, status);

  message.status = status;

  for (a in listArduinos) {
    listArduinos[a].write(getMessage(message));
  };

  client.broadcast.emit('message', message);
  client.emit('message', message);

};

function getMessage(message){
  return '<' + message.pin + ',' + message.status + '>';
};

io.on('connection', function(client){
  listClients.push(client);
  client.on('message', function(obj){
    console.log(obj);
    toogle(obj.message, client, obj.status);
  });
  client.on('disconnect', function(){
    for(var i = 0; i < listClients.length; i++){
      if(listClients[i].id == client.id){
        listClients.splice(i, 1);
      }
    }
  });
});

tcpServer.on('connection',function(socket){
  console.log('Arduino conectado');
  listArduinos.push(socket);
  socket.on('data',function(data){
    console.log(data.toString());
    /*for (g in io.clients) {
      var client = io.clients[g];
      db.Arduino.find({ where: { pin: data.toString()  } }).success(function(entity) {
        if(entity){
          toogle(entity, client);
        }
      });
    }*/
  })
});

db.sequelize.sync({ force: false }).complete(function(err) {
  if (err) {
    throw err
  } else {
    http.listen(app.get('port'), function(){
      console.log('NodeJS está na porta: ' + app.get('port') + '.');
    });
    tcpServer.listen(1337, function(){
      console.log('Socket está na porta: 1337.');
    });
  }
})

function _getTime(data){
  var _final = '';
  if(parseInt(data.getHours()) < 10){
    _final = _final + "0" + parseInt(data.getHours());
  }else{
    _final = _final + parseInt(data.getHours());
  }
  if(parseInt(data.getMinutes()) < 10){
    _final = _final + "0" + parseInt(data.getMinutes());
  }else{
    _final = _final + parseInt(data.getMinutes());
  }
  return _final;
};

setInterval(function(){
  task.execute(listArduinos, listClients, "1700");
  /*time = _getTime(new Date());
  if(time.slice(2,4) == "00"){
    task.execute(listArduinos, listClients, time);
  }else if(time.slice(2,4) == "34"){
    task.execute(listArduinos, listClients, time);
  }*/
}, 5000)