var app = angular.module('AngularShell', ["ngRoute"]);

app.controller('MainController', ['$scope', function($scope) {
  // Create Main Controller
  console.log("MainController running...");

  $scope.username = 'Joey Padasian';

  $scope.info = {
    product: 'Pop Tarts',
    serialNumber: '12345ZX'
  };

  $scope.displayName = function() {
    alert('The name is '+ $scope.username);
  };

}]);

app.controller('InformationController', ['$scope', function($scope) {
  // Create Information Controller
  console.log("InformationController running...");

  $scope.names = ['Darrel', 'Francesca', 'Courtney'];


}]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      }).
      when('/info', {
        templateUrl: 'views/information.html',
        controller: 'InformationController'
      }).
      otherwise({
        redirectTo: '/main'
      });
  }]);