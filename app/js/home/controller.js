define(['js/app', 'socketIO'], function (app, socketIO) {
  app.controller('home', ['$scope', '$http', function ($scope, $http) {

  	var socket = new socketIO.connect('http://pesagem.ranchobom.com');

		socket.on('message', function(sensor){
  		for(var i = 0; i < $scope.data.data.length; i++){
  			if($scope.data.data[i].id == sensor.id){
  				$scope.data.data[i].status = sensor.status;
  				$scope.$apply();
  			}
  		}
		});

		$http.get('http://pesagem.ranchobom.com/real-time').success(function(data) {
			$scope.data = {};
      angular.extend($scope.data, {
        data: data
      });
    });

    $scope.toogle = function(sensor){
    	socket.send(sensor);
    };

  }]);
});
