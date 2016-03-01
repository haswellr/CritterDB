
var userCtrl = function ($scope,User,Auth,$location) {
	$scope.user = {
		rememberme: true
	};

	$scope.createUser = function(){
		User.create($scope.user,function(data){
			console.log("created user: "+JSON.stringify(data));
			//use auth service to get token for user
			Auth.login($scope.user.username,$scope.user.password,false,function(){
				$location.url('/');
			});
		},function(err){
			console.log("error: "+err);
		});
	}

	$scope.login = function(){
		Auth.login($scope.user.username,$scope.user.password,$scope.user.rememberme,function(){
			$location.url('/');
		});
	}

	$scope.goToSignup = function(){
		$location.url('/signup');
	}

	$scope.goToLogin = function(){
		$location.url('/login');
	}
};

angular.module('myApp').controller('userCtrl',userCtrl);
