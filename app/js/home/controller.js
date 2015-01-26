define(['js/app', 'socketIO'], function (app, socketIO) {
  app.controller('home', ['$scope', '$http', function ($scope, $http) {

  	var socket = new socketIO.connect({ rememberTransport: false });

		socket.on('message', function(sensor){
  		for(var i = 0; i < $scope.data.data.length; i++){
  			if($scope.data.data[i].id == sensor.id){
  				$scope.data.data[i].status = sensor.status;
  				$scope.$apply();
  			}
  		}
		});

		$http.get('/real-time').success(function(data) {
			$scope.data = {};
      angular.extend($scope.data, {
        data: data
      });
    });

    $scope.sensorOn = function(sensor){
    	socket.send({ message: sensor, status: 1 });
    };

    $scope.sensorOff = function(sensor){
			socket.send({ message: sensor, status: 0 });
    };

  }]);
});
