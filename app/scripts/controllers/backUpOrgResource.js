app.controller('BackUpOrgResourceCtrl', function($scope, $http, $location,$rootScope, $localStorage,$uibModal,$log,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.resources.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.resources.id;
	$scope.showOrgBackupSchedules = true;
	$scope.pageHeading = 'Backup Resources';
	
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+$scope.subsystemid, commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgHis = $scope.getProcessedHistory(data.resourceBackUpInfoList);
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
	
	$scope.viewDetailedStatus = function(consoleInfo) {
		$scope.showModal = !$scope.showModal;
		var resources = JSON.parse(consoleInfo.resourceInfo);
		var resourceArray = $scope.getProcessedResources(resources);
		$scope.resourceInfo = resourceArray;
	}
	
	$scope.showCleanupResources = function() {
		if(!$scope.organization || !$scope.environments.length) {
			$scope.addAlert({ type: 'danger', msg: 'Please select Organization and Environments.' });
			return;
		}
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
			$scope.data = data;
			$scope.open(data);
		});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.addAlert({ type: 'danger', msg: 'We are facing issues. Please try again later!!' });
		});
		
	}
	
	$scope.open = function(data) {
		var modalInstance = $uibModal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'cleanupResourcesModal.html',
			controller : 'CleanupResourcesModalInstanceCtrl',
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
	
	$scope.seeAllSchedules = function() {
		$scope.showBackups = !$scope.showBackups;
		$scope.getScheduledBackups();
	}
	
	$scope.getScheduledBackups = function() {
		var user = {
				"email": $rootScope.userDetails.userName
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "resourcebackup/schduledbackups", user, {});
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
	
	$scope.saveBackupSchedule = function(selOrg,periodicity) {
		if(!selOrg || !periodicity) {
			$scope.addAlert({ type: 'danger', msg: 'Please select Organization and periodicity' });
			return;
		}
		var reqObj = {
				"organization" : selOrg,
				"periodicity" : periodicity
		};
		var responsePromise = $http.post($rootScope.baseUrl+ "resourcebackup/save", reqObj, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.addAlert({ type: 'success', msg: 'Saved Successfully!!' });
		});
		responsePromise.error(function(data, status, headers, config) {
			$scope.addAlert({ type: 'danger', msg: 'We are facing issues. Please try again later!!' });
		});
	}
	
	$scope.deleteScheduleResource = function(id) {
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
		var responsePromise = $http.post($rootScope.baseUrl+ "resourcebackup/delete", scheduledBackup, {});
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
	
	$scope.updateScheduleResource = function(organization,periodicity,id) {
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
		var responsePromise = $http.post($rootScope.baseUrl+ "resourcebackup/update", scheduledBackup, {});
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