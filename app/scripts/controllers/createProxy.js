app.controller('CreateProxyCtrl', function($scope, $http, $location,
		$rootScope, $localStorage) {
	$scope.orgs = [];
	$scope.showOther = false;
	$scope.orgText = "";
	var orgs = $rootScope.userDetails.organizations || [];
	for (var i = 0; i < orgs.length; i++) {
		$scope.orgs.push(orgs[i]);
	}
	$scope.orgs.push('Other');
	$scope.changeOrg = function(event) {
		if ($scope.organization == 'Other') {
			$scope.orgText = "";
			$scope.showOther = true;
		} else {
			$scope.showOther = false;
		}
	}

	$scope.createAPIProxy = function() {
		var org = $scope.organization;
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}

		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org,
			"apiProxyName" : $scope.apiProxyName
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/createproxy", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});