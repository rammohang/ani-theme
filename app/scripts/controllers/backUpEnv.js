app.controller('BackUpEnvCtrl',function($scope, $location, $rootScope, $http, $localStorage,$uibModal,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.org.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.org.id;
	$scope.showOrgBackupSchedules = false;
	$scope.pageHeading = 'Backup Environment';
	$scope.animationsEnabled = true;
	$scope.orgMap = undefined;
	$scope.envList = [];
	$scope.consoleInfo = {};
	
	var orgs = $rootScope.userDetails.organizations || [];
	var userInput = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password,
		"organizations" : orgs
	};
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/environmentslist/organizations", userInput, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgMap = data;
	});		
	responsePromise.error(function(data, status, headers, config) {
		$scope.addAlert({ type: 'danger', msg: 'We are facing issues. Please try again later!!' });
	});
	
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+$scope.subsystemid, commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgHis = $scope.getProcessedHistory(data.orgBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		$scope.addAlert({ type: 'danger', msg: 'We are facing issues. Please try again later!!' });
	});
	
	$scope.changeOrg = function() {
		$scope.envList = [];
		$scope.environments = [];
		if ($scope.organization == 'Other') {
			$scope.orgText = "";
			//$scope.showOther = true;
		} else {
			$scope.showOther = false;
			$scope.envList = $scope.orgMap[$scope.organization] || [];
		}
	}
	

	$scope.backUp = function() {
		if(!$scope.organization || !$scope.environments.length) {
			$scope.addAlert({ type: 'danger', msg: 'Please select Organization and Environments.' });
			return;
		}
		console.dir($scope.environments);
		$scope.cleanupLoader = true;
		var reqObj = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : $scope.organization,
			"environments" : $scope.environments
		};
		
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/environment/resources", reqObj, {});
		responsePromise.success(function(data, status, headers, config) {
			 console.dir(data);
			 $scope.cleanupLoader = false;
			 $scope.open();
		});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.addAlert({ type: 'danger', msg: 'We are facing issues. Please try again later!!' });
		});
		
	}
	
	$scope.viewDetailedStatus = function(consoleInfo) {
		// 1. Proxies Info to be displayed
		var proxies = JSON.parse(consoleInfo.proxyInfo);
		var formattedArray = $scope.getProcessedProxies(proxies);
		$scope.consoleInfo.proxyInfo = formattedArray;
		// 2.Resource Info to be displayed
		var resources = JSON.parse(consoleInfo.resourceInfo);
		var resourceArray = $scope.getProcessedResources(resources);
		$scope.consoleInfo.resourceInfo = resourceArray;
		//3. APPS info to be displayed
		$scope.consoleInfo.appsInfo = JSON.parse(consoleInfo.appsInfo);
		//4. PRODUCTS info to be displayed
		var productData = JSON.parse(consoleInfo.productsInfo);
		$scope.consoleInfo.productsInfo = productData.PRODUCTS;
		//5. DEV info to be displayed
		$scope.consoleInfo.developersInfo = JSON.parse(consoleInfo.developersInfo);
		$scope.open('lg');
	}
	
	$scope.open = function(size) {
		var modalInstance = $uibModal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'myModalContent.html',
			controller : 'ModalInstanceCtrl',
			size : size,
			resolve : {
				consoleInfo : function() {
					return $scope.consoleInfo;
				}
			}
		});
	};

});

