app.controller('BackUpProxyCtrl', function($scope, $http, $location,$rootScope, $localStorage,$uibModal,$log,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.apiproxies.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.apiproxies.id;
	$scope.showOrgBackupSchedules = false;
	$scope.pageHeading = 'Backup Proxies';
	$scope.data = {};
	$scope.data.selection = [];
	
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+$scope.subsystemid, commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgHis = getProcessedHistory(data.proxyBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		alert("oops !!! we are facing issues.");
	});
	
	$scope.viewDetailedStatus = function(consoleInfo) {
		$scope.showModal = !$scope.showModal;
		var proxies = JSON.parse(consoleInfo.proxyInfo);
		var formattedArray = $scope.getProcessedProxies(proxies);
		$scope.proxyInfo = formattedArray;
	}
	
	$scope.showCleanupProxies = function(commonConfiguration) {
		$scope.cleanupLoader = true;
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getapiproxies", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			var proxies = [];
			for (var i = 0; i < data.length; i++) {
				proxies.push({
					"name" : data[i],
					"selected" : false
				});
			}
			commonConfiguration.proxies = proxies;
			$scope.data = commonConfiguration;
			$scope.cleanupLoader = false;
			$scope.open(commonConfiguration);
		});		
		responsePromise.error(function(data, status, headers, config) {
			alert("oops !!! we are facing issues.");
		});
	}
	
	$scope.open = function(data) {
		var modalInstance = $uibModal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'cleanupProxiesModal.html',
			controller : 'CleanupProxiesModalInstanceCtrl',
			size : undefined,
			resolve : {
				data : function() {
					return $scope.data;
				}
			}
		});
		modalInstance.result.then(function(data) {
			$scope.data = data;
			$scope.backUp('cleanup',data);
		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
});