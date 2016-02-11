app.controller('BackUpOrgCtrl',function($scope, $location, $rootScope, $http, $localStorage,$uibModal,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.org.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.org.id;
	$scope.showOrgBackupSchedules = true;
	$scope.animationsEnabled = true;
	$scope.backupSchedules = [];
	$scope.periodicities = ['Weekly','Daily','Hourly'];
	$scope.consoleInfo = {};
	
	if($scope.showOrgBackupSchedules == true) {
		getScheduledBackups();
	}
    
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+$scope.subsystemid, commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgHis = getProcessedHistory(data.orgBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		alert("oops !!! we are facing issues.");
	});
	
	$scope.viewDetailedStatus = function(consoleInfo) {
		// use this oid as a key to get detailed console info
		//$scope.showModal = !$scope.showModal;
		// populate detailed into bootstrap modal
		// 1. Proxies Info to be displayed
		var proxyInfo = JSON.parse(consoleInfo.proxyInfo);
		var formattedArray = [];
		for(var i=0;i<proxyInfo.length;i++) {
		  var proxyObj = proxyInfo[i];
		  var singleProxyInfo = {};
		  singleProxyInfo["proxyName"]=Object.keys(proxyObj)[0];
		  var proxyContents = proxyObj[singleProxyInfo["proxyName"]];
		  for(var key in proxyContents) {
		    singleProxyInfo[key] = proxyContents[key];
		  }
		  formattedArray.push(singleProxyInfo);
		}
		$scope.consoleInfo.proxyInfo = formattedArray;
		
		// 2.Resource Info to be displayed
		var resourceInfo = JSON.parse(consoleInfo.resourceInfo);
		var resourceArray = [];
		for(var i=0;i<resourceInfo.length;i++) {
		  var proxyObj = resourceInfo[i];
		  var singleResourceInfo = {};
		  singleResourceInfo["envName"]=Object.keys(proxyObj)[0];
		  var proxyContents = proxyObj[singleResourceInfo["envName"]];
		  for(var key in proxyContents) {
		    singleResourceInfo[key] = proxyContents[key];
		  }
		  resourceArray.push(singleResourceInfo);
		}
		$scope.consoleInfo.resourceInfo = resourceArray;
		//3. APPS info to be displayed
		$scope.consoleInfo.appsInfo = JSON.parse(consoleInfo.appsInfo);
		//4. PRODUCTS info to be displayed
		var productData = JSON.parse(consoleInfo.productsInfo);
		$scope.consoleInfo.productsInfo = productData.PRODUCTS;
		$scope.consoleInfo.skippedProductsInfo = productData.SKIPPEDPRODUCTS;
		//5. DEV info to be displayed
		$scope.consoleInfo.developersInfo = JSON.parse(consoleInfo.developersInfo);
		$scope.open('lg');
	}
	
	$scope.saveBackupSchedule = function(scheduledOrg,periodicity) {
		if(!scheduledOrg || !periodicity) {
			alert('Please select organization and periodicity');
			return;
		}
		var backupSchedule = {
				"organization":scheduledOrg,
				"periodicity" : periodicity
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "backup/save", backupSchedule, {});
		responsePromise.success(function(data, status, headers, config) {
			alert("schedule saved");
		});
		responsePromise.error(function(data, status, headers,
				config) {
			alert("Failed to save!");
		});
	}
	
	$scope.seeAllSchedules = function() {
		$scope.showBackups = !$scope.showBackups;
		getScheduledBackups();
	}
	
	$scope.changeScheduleOrg = function() {
		if(!$scope.scheduledOrg) {
			$scope.periodicity = '';
		} else {
			var flag = false;
			for(var i=0;i<$scope.backupSchedules.length;i++) {
				if($scope.backupSchedules[i].organization == $scope.scheduledOrg ) {
					flag = true;
					$scope.periodicity = $scope.backupSchedules[i].periodicity;
					break;
				}
			}
			if(!flag) {
				$scope.periodicity = '';
			}
		}
	}
	
	$scope.deleteScheduleOrg = function(id) {
		for(var i = 0; i < $scope.backupSchedules.length; i++) {
			if($scope.backupSchedules[i].id == id) {
				$scope.backupSchedules[i].deleteLoader = true;
				$scope.backupSchedules.splice(i, 1);
				break;
			}
		}
		var scheduledBackup = {
				"id": id
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "backup/delete", scheduledBackup, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.scheduledOrg = '';
			$scope.periodicity = '';
			for(var i = 0; i < $scope.backupSchedules.length; i++) {
				if($scope.backupSchedules[i].id == id) {
					$scope.backupSchedules.splice(i, 1);
					$scope.backupSchedules[i].deleteLoader = false;
					break;
				}
			}
		});
		responsePromise.error(function(data, status, headers,
				config) {
			alert("Failed to delete!");
			for(var i = 0; i < $scope.backupSchedules.length; i++) {
				if($scope.backupSchedules[i].id == id) {
					$scope.backupSchedules.splice(i, 1);
					$scope.backupSchedules[i].deleteLoader = false;
					break;
				}
			}
		});
	}
	
	$scope.updateScheduleOrg = function(organization,periodicity) {
		for(var i=0;i<$scope.backupSchedules.length;i++) {
			if(organization==$scope.backupSchedules[i].organization) {
				$scope.backupSchedules[i].updateLoader = true;
				break;
			}
		}
		var scheduledBackup = {
				"organization": organization,
				"periodicity":periodicity
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "backup/save", scheduledBackup, {});
		responsePromise.success(function(data, status, headers, config) {
			for(var i=0;i<$scope.backupSchedules.length;i++) {
				if(organization==$scope.backupSchedules[i].organization) {
					$scope.backupSchedules[i].periodicity = periodicity;
					$scope.backupSchedules[i].updateLoader = false;
					break;
				}
			}
		});
		responsePromise.error(function(data, status, headers,config) {
			alert("Failed to update!");
			for(var i=0;i<$scope.backupSchedules.length;i++) {
				if(organization==$scope.backupSchedules[i].organization) {
					$scope.backupSchedules[i].updateLoader = false;
					break;
				}
			}
		});
	}
	
	function getScheduledBackups() {
		var user = {
				"email": $rootScope.userDetails.userName
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "backup/schduledbackups", user, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.backupSchedules = getProcessedHistory(data);
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Failed to retrieve!");
		});
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

