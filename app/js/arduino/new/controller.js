define(['js/app'], function (app) {
  app.controller('newArduino', ['$scope', '$http', 'SweetAlert', '$routeParams', '$window', function ($scope, $http, SweetAlert, $routeParams, $window) {

    function clear() {
      angular.extend($scope, {
        data: {
          description: '',
          pin: 2,
          labelOn: '',
          labelOff: ''
        }
      });
    };

    if($routeParams.id){
      $http.get('http://pesagem.ranchobom.com/arduino/' + $routeParams.id).success(function(data) {
        angular.extend($scope, {
          data: data
        });
      });
    }else{
      clear();
    }

    $scope.save = function(){
      $http.post('http://home-arduino.herokuapp.com/arduino', $scope.data).success(function(data) {
        if($routeParams.id){
          $window.location = '/home#sensor';
        }else{
          SweetAlert.success(data.message, "", "<i class='glyphicon glyphicon-ok'></i>&nbsp;&nbsp;Ok");
          clear();
        }
      });
    };

  }]);
});
