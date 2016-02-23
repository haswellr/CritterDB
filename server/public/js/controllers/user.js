
var userCtrl = function ($scope,User,Auth) {
	$scope.user = {};

	$scope.createUser = function(){
		User.create($scope.user,function(data){
			console.log("created user: "+JSON.stringify(data));
			//use auth service to get token for user
			Auth.login($scope.user.username,$scope.user.password);
			//return to index page
		},function(err){
			console.log("error: "+err);
		});
	}
};

angular.module('myApp').controller('userCtrl',userCtrl);
