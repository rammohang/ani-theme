app.controller('cleanRevisionsCtrl', function($scope, $http, $location,$rootScope, $localStorage,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.proxyrevision.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.proxyrevision.id;
	$scope.showOrgBackupSchedules = false;
	$scope.showBackupBtn = false;
	$scope.pageHeading = 'Cleanup Revisions';
	
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+$scope.subsystemid, commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgHis = getProcessedHistory(data.proxyRevisionBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		alert("oops !!! we are facing issues.");
	});
	
	$scope.viewDetailedStatus = function(consoleInfo) {
		$scope.showModal = !$scope.showModal;
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
		$scope.proxyInfo = formattedArray;
	}
	
});