app.controller('BackUpOrgCtrl',function($scope, $location, $rootScope, $http, $localStorage,$uibModal,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.org.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.org.id;
	$scope.showOrgBackupSchedules = true;
	$scope.pageHeading = 'Backup Organization';
	$scope.animationsEnabled = true;
	$scope.backupSchedules = [];
	$scope.periodicities = ['Weekly','Daily','Hourly'];
	$scope.consoleInfo = {};
	
	$scope.getScheduledBackups = function() {
		var user = {
				"email": $rootScope.userDetails.userName
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "backup/schduledbackups", user, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.backupSchedules = $scope.getProcessedHistory(data);
		});
		responsePromise.error(function(data, status, headers, config) {
			$scope.addAlert({ type: 'danger', msg: 'We are facing issues. Please try again later!!' });
		});
	} 
	
	if($scope.showOrgBackupSchedules == true) {
		$scope.getScheduledBackups();
	}
    
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
	
	$scope.saveBackupSchedule = function(scheduledOrg,periodicity) {
		if(!scheduledOrg || !periodicity) {
			$scope.addAlert({ type: 'danger', msg: 'Please select organization and periodicity' });
			return;
		}
		var backupSchedule = {
				"organization":scheduledOrg,
				"periodicity" : periodicity
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "backup/save", backupSchedule, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.addAlert({ type: 'success', msg: 'Saved Successfully!!' });
		});
		responsePromise.error(function(data, status, headers,
				config) {
			$scope.addAlert({ type: 'danger', msg: 'Failed to Save!!' });
		});
	}
	
	$scope.seeAllSchedules = function() {
		$scope.showBackups = !$scope.showBackups;
		$scope.getScheduledBackups();
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
			$scope.addAlert({ type: 'danger', msg: 'Failed to delete!!' });
			for(var i = 0; i < $scope.backupSchedules.length; i++) {
				if($scope.backupSchedules[i].id == id) {
					$scope.backupSchedules.splice(i, 1);
					$scope.backupSchedules[i].deleteLoader = false;
					break;
				}
			}
		});
	}
	
	$scope.updateScheduleOrg = function(organization,periodicity,id) {
		for(var i=0;i<$scope.backupSchedules.length;i++) {
			if(organization==$scope.backupSchedules[i].organization) {
				$scope.backupSchedules[i].updateLoader = true;
				break;
			}
		}
		var scheduledBackup = {
				"id": id,
				"organization": organization,
				"periodicity":periodicity
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "backup/update", scheduledBackup, {});
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
			$scope.addAlert({ type: 'danger', msg: 'Failed to update!!' });
			for(var i=0;i<$scope.backupSchedules.length;i++) {
				if(organization==$scope.backupSchedules[i].organization) {
					$scope.backupSchedules[i].updateLoader = false;
					break;
				}
			}
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

