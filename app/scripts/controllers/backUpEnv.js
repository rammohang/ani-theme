app.controller('BackUpEnvCtrl',function($scope, $location, $rootScope, $http, $localStorage,$uibModal,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.environments.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.environments.id;
	$scope.showOrgBackupSchedules = true;
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
		 $scope.orgHis = $scope.getProcessedHistory(data.environmentBackUpInfoList);
		 console.log($scope.orgHis);
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
	
	$scope.changeScheduleOrganization = function(selOrg) {
		$scope.scheduleEnvList = [];
		if(selOrg) {
			$scope.scheduleEnvList = $scope.orgMap[selOrg] || [];
		} 
		console.log($scope.scheduleEnvList);
	}
	
	$scope.viewDetailedStatus = function(consoleInfo) {
		console.log(consoleInfo);
		// 1. Proxies Info to be displayed
		var proxies = JSON.parse(consoleInfo.envProxyInfo);
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
	
	$scope.seeAllSchedules = function() {
		$scope.showBackups = !$scope.showBackups;
		$scope.getScheduledBackups();
	}
	
	$scope.getScheduledBackups = function() {
		var user = {
				"email": $rootScope.userDetails.userName
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "envbackup/schduledbackups", user, {});
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
	
	$scope.saveBackupSchedule = function(selOrg,scheduledEnv,periodicity) {
		if(!selOrg || !scheduledEnv || !periodicity) {
			$scope.addAlert({ type: 'danger', msg: 'Please select Organization, Environment and periodicity' });
			return;
		}
		var reqObj = {
				"organization" : selOrg,
				"environment" : scheduledEnv,
				"periodicity" : periodicity
		};
		var responsePromise = $http.post($rootScope.baseUrl+ "envbackup/save", reqObj, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.backupSchedules = $scope.getProcessedHistory(data);
		});
		responsePromise.error(function(data, status, headers, config) {
			$scope.addAlert({ type: 'danger', msg: 'We are facing issues. Please try again later!!' });
		});
	}
	
	$scope.deleteScheduleEnv = function(id) {
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
		var responsePromise = $http.post($rootScope.baseUrl+ "envbackup/delete", scheduledBackup, {});
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
	
	$scope.updateScheduleEnv = function(organization,environment,periodicity,id) {
		for(var i=0;i<$scope.backupSchedules.length;i++) {
			if(organization==$scope.backupSchedules[i].organization) {
				$scope.backupSchedules[i].updateLoader = true;
				break;
			}
		}
		var scheduledBackup = {
				"id": id,
				"organization": organization,
				"environment" : environment,
				"periodicity":periodicity
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "envbackup/update", scheduledBackup, {});
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
	
});

