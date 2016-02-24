app.controller('BackUpEnvCtrl',function($scope, $location, $rootScope, $http, $localStorage,$uibModal,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.org.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.org.id;
	$scope.showOrgBackupSchedules = false;
	$scope.pageHeading = 'Backup Environment';
	$scope.animationsEnabled = true;
	$scope.consoleInfo = {};
	
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

