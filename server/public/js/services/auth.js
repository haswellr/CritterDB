angular.module('myApp').factory("Auth", ['$cookies','$http','$location','authHttpRequestInterceptor', function($cookies,$http,$location,authHttpRequestInterceptor) {
  var serv = {};

  serv.isLoggedIn = function(){
    return(serv.user!=undefined);
  }

  serv.login = function(username,password,rememberme){
    console.log("login");
    if(!username)
      username = $cookies.get('bestiarymanagerusername');
    if(username){
      var data = {
        'username': username,
        'password': password,
        'rememberme': rememberme
      };
      $http.post('/api/authenticate',data).then(function(data){
        authHttpRequestInterceptor.token = data.data;
        $http.get('/api/authenticate/user').then(function(data){
          serv.user = data.data;
          $location.url('/');
        },function(err){
          console.log("error getting current user: "+err);
        });
      },function(err){
        console.log("error authenticating: "+err);
        token = undefined;
      });
    }
  }
  serv.login(); //try login in case 'rememberme' is set

  return serv;
}]);
