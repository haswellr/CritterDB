angular.module("myApp").factory("authHttpRequestInterceptor", [function () {
  var serv = {};

  serv.token = undefined;
  serv.request = function (config) {
    if (serv.token) {
        config.headers["x-access-token"] = serv.token;
    }

    return config;
  };

  return serv;
}]);
