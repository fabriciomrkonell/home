define(['js/app'], function (app) {
  app.controller('arduino', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $http.get('/arduino').success(function(data) {
      angular.extend($scope, {
        data: data
      });
    });

    $scope.update = function(obj) {
      $window.location = '/home#novo-sensor/' + obj.id;
    };

    $scope.delete = function(obj, index) {
      $http.delete('/arduino/' + obj.id).success(function(data) {
        $scope.data.splice(index, 1);
      })
    };

  }]);
});
