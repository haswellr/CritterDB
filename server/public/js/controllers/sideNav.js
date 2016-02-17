
var sideNavCtrl = function ($scope,$mdSidenav) {
  $scope.close = function(id) {
    $mdSidenav(id).close();
  };
  $scope.toggle = function(id) {
    $mdSidenav(id).toggle();
  }
};

angular.module('myApp').controller('sideNavCtrl',sideNavCtrl);
