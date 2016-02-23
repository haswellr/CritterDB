
var userCtrl = function ($scope,User) {
	$scope.user = {};

	$scope.createUser = function(){
		User.create($scope.user,function(data){
			console.log("created user: "+JSON.stringify(data));
			//use auth service to get token for user
			//return to index page
		},function(err){
			console.log("error: "+err);
		});
	}
};

angular.module('myApp').controller('userCtrl',userCtrl);
