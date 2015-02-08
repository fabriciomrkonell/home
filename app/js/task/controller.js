define(['js/app'], function (app) {
  app.controller('task', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    function init(){
      $http.get('http://pesagem.ranchobom.com/task').success(function(data) {
        angular.extend($scope, {
          data: data
        });
      });
    };

    init();

    $scope.getStatus = function(obj){
      if(obj.status == 0){
        return obj.Arduino.labelOff;
      }
      return obj.Arduino.labelOn;
    };

    $scope.getDate = function(date){
      return date.slice(6, 8) + '/' + date.slice(4, 6) + '/' + date.slice(0, 4);
    };

    $scope.getTime = function(time){
      return time.slice(0, 2) + ':' + time.slice(2, 4);
    };

    $scope.getToday = function(obj){
      if(obj.repeat == "0"){
        return "Não";
      }
      return "Sim";
    };

    $scope.toogleRepeat = function(obj){
      $http.post('http://pesagem.ranchobom.com/task/toogle/' + obj.id).success(function(){
        init();
      })
    };

    $scope.delete = function(obj, index, type) {
      $http.delete('http://pesagem.ranchobom.com/task/' + obj.id).success(function(data) {
        if(type == 1){
          $scope.data.today.splice(index, 1);
        }else if (type == 2){
          $scope.data.nexts.splice(index, 1);
        }else{
          $scope.data.finished.splice(index, 1);
        }
      })
    };

  }]);
});
