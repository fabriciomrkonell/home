define(['js/app'], function (app) {
  app.controller('newTask', ['$scope', '$http', 'SweetAlert', function ($scope, $http, SweetAlert) {

    function clear() {
      angular.extend($scope, {
        data: {
          arduino: 0,
          date: getDate(),
          time: '0000',
          status: 0
        }
      });
    };

    function getDate() {
      var a = new Date();
      return a.getFullYear() + '-01-01';
    }

    clear();

    $http.get('http://pesagem.ranchobom.com/arduino').success(function(data) {
      angular.extend($scope, {
        arduinos: data
      });
    });

    $scope.getStatus = function(type){
      var _arduino = $scope.arduinos[$scope.data.arduino];
      if(type == 1){
        if(_arduino){
          return _arduino.labelOn;
        }else{
          return '';
        }
      }
      if(_arduino){
        return _arduino.labelOff;
      }else{
        return '';
      }
    };

    $scope.save = function(){
      $scope.data.ArduinoId = $scope.arduinos[$scope.data.arduino].id;
      $http.post('http://pesagem.ranchobom.com/task', $scope.data).success(function(data) {
        SweetAlert.success(data.message, "", "<i class='glyphicon glyphicon-ok'></i>&nbsp;&nbsp;Ok");
        clear();
      });
    };

  }]);
});
