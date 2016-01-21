app.controller('LoginCtrl', function($scope, $http, $location, $rootScope,
		$localStorage) {
	var userDetails = $localStorage.userDetails;
	$rootScope.userDetails = userDetails;
	if (userDetails && userDetails.userLoggedIn == true) {
		$location.path('/dashboard');
	}

	$scope.submit = function() {
		var userDetails = {
			"email" : $scope.email,
			"password" : $scope.password
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "user/authenticate", userDetails, {});
		responsePromise.success(function(data, status, headers, config) {
			if (data.userName) {
				var userDetails = {};
				userDetails.userName = data.email;
				userDetails.password = data.password;
				userDetails.displayName = data.userName;
				userDetails.userLoggedIn = true;
				userDetails.organizations = data.organizations || [];
				$rootScope.userDetails = userDetails;
				$localStorage.userDetails = userDetails;
				$location.path('/dashboard');
			} else {
				alert("Invalid username/password. Please try again !!");
			}
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});

	}
});