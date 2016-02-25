app.controller('BackUpEnvCtrl',function($scope, $location, $rootScope, $http, $localStorage,$uibModal,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.environments.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.environments.id;
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
	
	$scope.viewDetailedStatus = function(consoleInfo) {
		// TODO
	}
	
});

