app.controller('BackUpOrgDevCtrl', function($scope, $http, $location,$rootScope, $localStorage,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.appdevelopers.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.appdevelopers.id;
	$scope.showOrgBackupSchedules = false;
	$scope.pageHeading = 'Backup Developers';
	
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+$scope.subsystemid, commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgHis = getProcessedHistory(data.developerBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		alert("oops !!! we are facing issues.");
	});
	
	$scope.viewDetailedStatus = function(consoleInfo) {
		$scope.showModal = !$scope.showModal;
		// populate detailed into bootstrap modal
		$scope.developersInfo = JSON.parse(consoleInfo.developerInfo);
	}
	
});