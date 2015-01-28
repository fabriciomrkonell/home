define(['angularAMD', 'angular-route'], function (angularAMD) {
  var app = angular.module("app", ['ngRoute']);

  app.factory("SweetAlert", function(){
    var swal = window.swal,
      self = {
        swal: function(arg1,arg2,arg3,arg4,arg5){
          swal(arg1,arg2,arg3,arg4,arg5)
        },
        success: function(title,message,text){
          swal(title,message,"success", text, 0)
        },
        error: function(title,message,text){
          swal(title,message,"error", text, 1)
        },
        warning:function(title,message,text){
          swal(title,message,"warning", text, 0)
        },
        info: function(title,message,text){
          swal(title,message,"info", text, 0)
        }
      };
    return self;
  });

  app.config(function ($routeProvider, $locationProvider, $httpProvider) {

   	$locationProvider.hashPrefix = '!';

    $routeProvider.when("/home", angularAMD.route({
      templateUrl: '/views/home/' + Math.random(),
      controller: 'home',
      controllerUrl: 'js/home/controller'
    })).when("/novo-sensor", angularAMD.route({
      templateUrl: '/views/arduino/new/' + Math.random(),
      controller: 'newArduino',
      controllerUrl: 'js/arduino/new/controller'
    })).when("/novo-sensor/:id", angularAMD.route({
      templateUrl: '/views/arduino/new/' + Math.random(),
      controller: 'newArduino',
      controllerUrl: 'js/arduino/new/controller'
    })).when("/sensor", angularAMD.route({
      templateUrl: '/views/arduino/' + Math.random(),
      controller: 'arduino',
      controllerUrl: 'js/arduino/controller'
    })).when("/nova-tarefa", angularAMD.route({
      templateUrl: '/views/task/new/' + Math.random(),
      controller: 'newTask',
      controllerUrl: 'js/task/new/controller'
    })).when("/nova-tarefa/:id", angularAMD.route({
      templateUrl: '/views/task/new/' + Math.random(),
      controller: 'newTask',
      controllerUrl: 'js/task/new/controller'
    })).when("/tarefa", angularAMD.route({
      templateUrl: '/views/task/' + Math.random(),
      controller: 'task',
      controllerUrl: 'js/task/controller'
    })).otherwise({redirectTo: "/home"});

    var httpStatusInterceptor = function($window){
      function success(response){
        if(response.data.error == 1){
          return error(response);
        }
        if(response.data.error == 2){
          return info(response);
        }
        return response;
      }
      function error(response) {
        return window.swal("Ops! Ocorreu algum erro.","","error", "<i class='glyphicon glyphicon-log-out'></i>&nbsp;&nbsp;Fechar", 1);
      }
      function info(response) {
        return window.swal(response.data.message,"","error", "<i class='glyphicon glyphicon-ok'></i>&nbsp;&nbsp;Ok", 0);
      }
      return function(promise) {
        return promise.then(success, error);
      }
    }
    $httpProvider.responseInterceptors.push(httpStatusInterceptor);
  });

  app.run(function($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
    });
  });

  app.controller("homeCtrl", function($scope, $window){
    $scope.sair = function(){
      $window.location.href = "/logout";
    };
  });

  return angularAMD.bootstrap(app);
});