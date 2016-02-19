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
		 $scope.orgHis = $scope.getProcessedHistory(data.productBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		alert("oops !!! we are facing issues.");
	});
	
	$scope.viewDetailedStatus = function(consoleInfo) {
		$scope.showModal = !$scope.showModal;
		var productData = JSON.parse(consoleInfo.productInfo);
		$scope.productsInfo = productData.PRODUCTS;
	}
	
});