angular.module('myApp').directive('uniqueEmail', ['$http','$q', function ($http,$q) {
  return {
    require: "ngModel",
    link: function(scope, element, attributes, ngModel) {
      ngModel.$asyncValidators.uniqueEmail = function(modelValue){
        return $http.get('/api/users/search?email='+modelValue).
          then(function resolved() {
            return $q.reject('exists');
          }, function rejected() {
            return true;
          });
      }
    }
  };
}]);
