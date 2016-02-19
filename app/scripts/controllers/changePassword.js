app.controller('ChangePasswordCtrl', function($scope, $http, $location, $rootScope, $localStorage) {
	
	var oldPassword = $rootScope.userDetails.password;
	var email = $rootScope.userDetails.userName;
	
	$scope.changePassword = function() {
		if($scope.oldPassword != oldPassword) {
			alert("Your old password do not match.");
			return;
		}
		var newPassword = $scope.newPassword;
		var confirmPassword = $scope.confirmPassword;
		if(newPassword != confirmPassword) {
			alert("new password and confirmPassword do not match!!");
			return;
		}
		
		var userDetails = {
			"email" : email,
			"password" : newPassword
		};
		var responsePromise = $http.post($rootScope.baseUrl + "user/changePassword", userDetails, {});
		responsePromise.success(function(data, status, headers, config) {
			if (data && data.id) {
				alert("password changed successfully");
				$localStorage.userDetails.password = data.password;
				$rootScope.userDetails.password = data.password;
				
				$scope.oldPassword = "";
				$scope.newPassword = "";
				$scope.confirmPassword = "";
			} else {
				alert("Failed to update");
			}
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	
});