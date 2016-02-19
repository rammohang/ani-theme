app.controller('MyAccountCtrl', function($scope, $http, $location, $rootScope, $localStorage) {
	
	var userName = $rootScope.userDetails.displayName;
	var email = $rootScope.userDetails.userName;
	var organizations = $rootScope.userDetails.organizations;
	var userDetails = {
			"email":email
	}
	var responsePromise = $http.post($rootScope.baseUrl + "user/profile", userDetails, {});
	responsePromise.success(function(data, status, headers, config) {
		if(data.id) {
			$scope.fullName = data.userName;
			$scope.organizationInfo = data.organizations.join();
		} else {
			alert("Error loading user details!");
		}
	});
	responsePromise.error(function(data, status, headers, config) {
		alert("Submitting form failed!");
	});
	
	
	$scope.updateProfile = function() {
		var organizationList = $scope.organizationInfo.split(',');
		var organizations = [];
		for(var i = 0; i < organizationList.length; i++) {
			organizations.push(organizationList[i].trim());
		}
		var userDetails = {
			"email" : $rootScope.userDetails.userName,
			"userName": $scope.fullName,
			"organizations" : organizations
		};
		var responsePromise = $http.post($rootScope.baseUrl + "user/updateProfile", userDetails, {});
		responsePromise.success(function(data, status, headers, config) {
			if (data && data.id) {
				alert("updated Successfully");
				$localStorage.userDetails.displayName = data.userName;
				$localStorage.userDetails.organizations = data.organizations;
				$rootScope.userDetails.displayName = data.userName;
				$rootScope.userDetails.organizations = data.organizations;
				
				$scope.fullName = "";
				$scope.organizationInfo = "";
			} else {
				alert("Failed to update");
			}
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	
	$scope.goBack = function() {
		window.history.back();
	}
	
});