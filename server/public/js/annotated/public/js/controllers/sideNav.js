var sideNavCtrl = function ($scope,$mdSidenav) {
  $scope.close = function(id) {
    $mdSidenav(id).close();
  };
  $scope.open = function(id) {
    $mdSidenav(id).open();
  };
  $scope.toggle = function(id) {
    $mdSidenav(id).toggle();
  };
  $scope.isOpen = function(id) {
    return($mdSidenav(id).isOpen());
  }
};
sideNavCtrl.$inject = ["$scope", "$mdSidenav"];

angular.module('myApp').controller('sideNavCtrl',sideNavCtrl);
