'use strict';

angular.module('home', []);

angular.module('home').controller('homeCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

  angular.extend($scope, {
    email: 'fabricioronchii@gmail.com',
    password: 'fabricioronchii@gmail.com'
  });

  $scope.login = function() {
    $http.post('/login', { username: $scope.email, password: $scope.password }).success(function(data){
      if(data.success == 1){
        $window.location = '/home';
      };
    });
  };
}]);