app.controller('SignUpCtrl', function($scope, $http, $location, $rootScope, $localStorage) {
	
	$scope.register = function() {
		var password = $scope.password;
		var confirmPassword = $scope.confirmPassword;
		if(password != confirmPassword) {
			alert("password and confirmPassword do not match!!");
			return;
		}
		
		var organizationList = $scope.organizationInfo.split(',');
		var organizations = [];
		for(var i = 0; i < organizationList.length; i++) {
			organizations.push(organizationList[i].trim());
		}
		var userDetails = {
			"userName" : $scope.fullName,
			"email" : $scope.email,
			"password" : password,
			"organizations" : organizations
		};
		var responsePromise = $http.post($rootScope.baseUrl + "user/register", userDetails, {});
		responsePromise.success(function(data, status, headers, config) {
			if (data && data.id) {
				alert("registered Successfully");
				$location.path('/login');
			} else {
				alert("registration failed!! Try again..");
			}
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	
});