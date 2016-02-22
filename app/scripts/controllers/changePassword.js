app.controller('ChangePasswordCtrl', function($scope, $http, $location, $rootScope, $localStorage,$controller) {
	$controller('BaseCtrl', {$scope: $scope}); //inherits BaseCtrl controller
	
	var oldPassword = $rootScope.userDetails.password;
	var email = $rootScope.userDetails.userName;
	
	$scope.changePassword = function() {
		if($scope.oldPassword != oldPassword) {
			$scope.addAlert({ type: 'danger', msg: 'Your old password do not match.' });
			return;
		}
		var newPassword = $scope.newPassword;
		var confirmPassword = $scope.confirmPassword;
		if(newPassword != confirmPassword) {
			$scope.addAlert({ type: 'danger', msg: 'new password and confirmPassword do not match!!' });
			return;
		}
		
		var userDetails = {
			"email" : email,
			"password" : newPassword
		};
		var responsePromise = $http.post($rootScope.baseUrl + "user/changePassword", userDetails, {});
		responsePromise.success(function(data, status, headers, config) {
			if (data && data.id) {
				$scope.addAlert({ type: 'success', msg: 'password changed successfully!!' });
				$localStorage.userDetails.password = data.password;
				$rootScope.userDetails.password = data.password;
				
				$scope.oldPassword = "";
				$scope.newPassword = "";
				$scope.confirmPassword = "";
			} else {
				$scope.addAlert({ type: 'danger', msg: 'Failed to update.' });
			}
		});
		responsePromise.error(function(data, status, headers, config) {
			$scope.addAlert({ type: 'danger', msg: 'Failed to update.' });
		});
	}
	
});