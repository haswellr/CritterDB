angular.module('myApp').factory("Auth", ['$cookies','$http','$location','authHttpRequestInterceptor', function($cookies,$http,$location,authHttpRequestInterceptor) {
  var serv = {};
  var triedLogin = false;
  var actionsAfterLogin = [];

  serv.isLoggedIn = function(){
    return(serv.user!=undefined);
  }

  serv.login = function(username,password,rememberme,successCallback,errorCallback){
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
          if(successCallback)
            successCallback();
        },function(err){
          console.log("error getting current user: "+err);
          if(errorCallback)
            errorCallback(err);
        });
      },function(err){
        console.log("error authenticating: "+err);
        if(errorCallback)
          errorCallback(err);
        token = undefined;
      });
    }
    else{
      errorCallback("Unable to find user");
    }
  }
  serv.login(undefined,undefined,undefined,function(){
    triedLogin = true;
    for(var i=0;i<actionsAfterLogin.length;i++)
      actionsAfterLogin[i]();
  },function(){
    triedLogin = true;
    for(var i=0;i<actionsAfterLogin.length;i++)
      actionsAfterLogin[i]();
  }); //try login in case 'rememberme' is set

  serv.executeOnLogin = function(action){
    if(triedLogin)
      setTimeout(action);
    else
      actionsAfterLogin.push(action);
  }

  serv.logout = function(successCallback,errorCallback){
    $http.post('/api/revokeauthentication',{}).then(function(data){
      successCallback(data.data);
    },function(err){
      errorCallback(err);
    });
  }

  return serv;
}]);
