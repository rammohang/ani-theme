app.controller('ExportProxyCtrl', function($scope, $http, $location,
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

	var userDetails = $localStorage.userDetails;
	$rootScope.userDetails = userDetails;
	if (!userDetails || !userDetails.userLoggedIn) {
		$location.path('/login');
	}
	$scope.logout = function() {
		$localStorage.userDetails = undefined;
	};

	$scope.proxyData = {};
	$scope.exportAPIProxy = function() {
		var org = $scope.organization;
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}

		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org,
			"apiProxyName" : $scope.apiProxyName,
			"revision" : $scope.revision
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/exportapiproxy", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			$scope.proxyData = data;
			console.log($scope.proxyData);
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});