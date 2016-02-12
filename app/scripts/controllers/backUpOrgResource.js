app.controller('BackUpOrgResourceCtrl', function($scope, $http, $location,$rootScope, $localStorage,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.resources.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.resources.id;
	$scope.showOrgBackupSchedules = false;
	$scope.pageHeading = 'Backup Resources';
	
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+$scope.subsystemid, commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgHis = getProcessedHistory(data.resourceBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		alert("oops !!! we are facing issues.");
	});

	$scope.viewDetailedStatus = function(consoleInfo) {
		$scope.showModal = !$scope.showModal;
		var resourceInfo = JSON.parse(consoleInfo.resourceInfo);
		var resourceArray = [];
		for (var i = 0; i < resourceInfo.length; i++) {
			var proxyObj = resourceInfo[i];
			var singleResourceInfo = {};
			singleResourceInfo["envName"] = Object.keys(proxyObj)[0];
			var proxyContents = proxyObj[singleResourceInfo["envName"]];
			for ( var key in proxyContents) {
				singleResourceInfo[key] = proxyContents[key];
			}
			resourceArray.push(singleResourceInfo);
		}
		$scope.resourceInfo = resourceArray;
	}
	
});