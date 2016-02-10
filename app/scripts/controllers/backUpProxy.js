app.controller('BackUpProxyCtrl', function($scope, $http, $location,$rootScope, $localStorage,$controller) {
	$controller('BackUpOrgCtrl', {$scope: $scope}); //inherits BackUpOrgCtrl controller
	
	$scope.subsystem = $rootScope.apigeeSubsystems.apiproxies.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.apiproxies.id;
	$scope.showOrgBackupSchedules = false;
	
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
	
});