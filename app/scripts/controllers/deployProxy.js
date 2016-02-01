app.controller('DeployProxyCtrl', function($scope, $http, $location,
		$rootScope, $localStorage) {
	
	$scope.orgs = [];
	$scope.dataMap = {};
	$scope.revisionList = [];
	
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
	
	
	//getList of api proxies
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

// getUndeployed data


	$scope.getUndeployments = function() {
		var org = $scope.organization;
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}
		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getundeployments", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.disable = true;
			$scope.dataMap = data;
			$scope.envList = Object.keys(data);
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	
	//get revision on change env
	$scope.changeEnv = function() {
		$scope.revisionList=$scope.dataMap[$scope.environment];
	};

	$scope.deployProxy = function() {
		var org = $scope.organization;
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}

		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org,
			"apiProxyName" : $scope.apiProxyName,
			"environment" : $scope.environment,
			"revision" : $scope.revision
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deployapiproxy", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			$scope.environment = "";
			$scope.revision = "";
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	
});