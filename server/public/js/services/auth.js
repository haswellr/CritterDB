angular.module('myApp').factory("Auth", ['$cookies','$http', function($cookies,$http) {
  var serv = {};

  serv.isLoggedIn = function(){
    return(serv.user!=undefined);
  }

  serv.login = function(username,password,rememberme){
    if(!username)
      username = $cookies.get('dmbestiary-username');
    if(!password)
      password = $cookies.get('dmbestiary-password');
    if(username && password){
      var data = {
        'username': username,
        'password': password
      }
      $http.post
    }
  }

  return serv;
}]);
