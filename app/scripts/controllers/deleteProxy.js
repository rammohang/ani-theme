app.controller('DeleteProxyCtrl', function($scope, $http, $location,
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

	$scope.proxiesList = "";
	$scope.disable = false;

	$scope.getAPIProxies = function() {
		var org = $scope.organization;
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}
		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/listapiproxies", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.disable = true;
			$scope.apiProxyName = "";
			$scope.proxiesList = data;
			console.log($scope.proxiesList);
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}

	$scope.deleteApiProxy = function() {
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
				+ "apigee/deleteapi", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			$scope.disable = false;
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});