angular.module('myApp').directive('uniqueUsername', ['$http','$q', function ($http,$q) {
  return {
    require: "ngModel",
    link: function(scope, element, attributes, ngModel) {
      ngModel.$asyncValidators.uniqueUsername = function(modelValue){
        return $http.get('/api/users/search?username='+modelValue).
          then(function resolved() {
            return $q.reject('exists');
          }, function rejected() {
            return true;
          });
      }
    }
  };
}]);
