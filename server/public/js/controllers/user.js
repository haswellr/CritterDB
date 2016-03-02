
var userCtrl = function ($scope,User,Auth,$location,$mdMedia,$mdDialog,$mdToast) {

	$scope.user = {
		rememberme: true
	};

	$scope.getCurrentUser = function(){
		return(Auth.user);
	}

	$scope.createUser = function(){
		User.create($scope.user,function(data){
			//use auth service to get token for user
			Auth.login($scope.user.username,$scope.user.password,true,function(){
				$location.url('/');
			});
		},function(err){
			console.log("error: "+err);
		});
	}

	$scope.login = function(){
		Auth.login($scope.user.username,$scope.user.password,$scope.user.rememberme,function(){
			$location.url('/');
		},function(err){
			if(err.status==403)
				$scope.user.invalidPassword = $scope.user.password;
			else
				$scope.user.invalidUsername = $scope.user.username;
		});
	}

	$scope.logout = function(){
		Auth.logout(function(data){
			$scope.goToLogin();
		});
	}

	$scope.forgotPassword = function(ev){
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: forgotPasswordCtrl,
      templateUrl: '/assets/partials/account/forgotpassword.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })
    .then(function(result){
    	if(result){
    		$mdToast.show(
    			$mdToast.simple()
    				.textContent(result)
    				.hideDelay(5000)
    		);
    	}
    });;
	}

	$scope.goToChangePassword = function(){
		$location.url('/account/newpassword');
	}

	$scope.goToSignup = function(){
		$location.url('/signup');
	}

	$scope.goToLogin = function(){
		$location.url('/login');
	}
};

angular.module('myApp').controller('userCtrl',userCtrl);


var updateUserCtrl = function ($scope,User,Auth,$location,user) {

	$scope.user = user;
	//username
	//currentPassword
	//password
	//email

	$scope.updateUser = function(){
		User.update($scope.user._id,$scope.user,function(data){
			//use auth service to get token for user
			Auth.login($scope.user.username,$scope.user.password,true,function(){
				$location.url('/');
			});
		},function(err){
			if(err.status==403)
					$scope.user.invalidPassword = $scope.user.currentPassword;
		});
	}
};

//don't load controller until we've gotten the data from the server
updateUserCtrl.resolve = {
			user: function(User, $q, $route, Auth, $location){
				var deferred = $q.defer();
				Auth.executeOnLogin(function(){
					var user = null;
					if(Auth.isLoggedIn())
						deferred.resolve(Auth.user);
					else if($route.current.params.id){
						User.getPublic($route.current.params.id,function(data){
							if($route.current.params.password)
								data.currentPassword = $route.current.params.password;
							deferred.resolve(data);
						},function(err){
							$location.path('/login');
							deferred.reject();
						});
					}
					else{
						$location.path('/login');
						deferred.reject();
					}
				});
				return deferred.promise;
			}
		}


angular.module('myApp').controller('updateUserCtrl',updateUserCtrl);

var forgotPasswordCtrl = function ($scope,User,$mdDialog) {

	$scope.user = {
		email:""
	};

	$scope.resetPassword = function() {
		User.resetPassword($scope.user.email,function(){
			$mdDialog.hide("An email has been sent to reset your password.");
		},function(){
			$scope.user.invalidEmail = $scope.user.email;
		});
	}

	$scope.hide = function() {
    $mdDialog.hide();
  };
	$scope.cancel = function() {
    $mdDialog.cancel();
  };
};
