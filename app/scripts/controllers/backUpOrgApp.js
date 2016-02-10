app.controller('BackUpOrgAppCtrl', function($scope, $http, $location,$rootScope, $localStorage,$controller) {
	
	$controller('BackUpOrgCtrl', {$scope: $scope}); //inherits BackUpOrgCtrl controller
	
	$scope.subsystem = $rootScope.apigeeSubsystems.apps.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.apps.id;
	$scope.showOrgBackupSchedules = false;
	
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+$scope.subsystemid, commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgHis = getProcessedHistory(data.appBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		alert("oops !!! we are facing issues.");
	});
	
});