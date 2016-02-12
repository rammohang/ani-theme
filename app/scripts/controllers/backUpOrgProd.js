app.controller('BackUpOrgProdCtrl', function($scope, $http, $location,$rootScope, $localStorage,$controller) {
	
	$controller('BackUpCommonCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = $rootScope.apigeeSubsystems.apiproducts.name;
	$scope.subsystemid = $rootScope.apigeeSubsystems.apiproducts.id;
	$scope.showOrgBackupSchedules = false;
	$scope.pageHeading = 'Backup Products';
	
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+$scope.subsystemid, commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgHis = getProcessedHistory(data.productBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		alert("oops !!! we are facing issues.");
	});
	
	$scope.viewDetailedStatus = function(consoleInfo) {
		// use this oid as a key to get detailed console info
		$scope.showModal = !$scope.showModal;
		// populate detailed into bootstrap modal
		
		// 1. Proxies Info to be displayed
		//4. PRODUCTS info to be displayed
		var productData = JSON.parse(consoleInfo.productInfo);
		console.log(productData+"---");
		$scope.productsInfo = productData.PRODUCTS;
	}
	
});