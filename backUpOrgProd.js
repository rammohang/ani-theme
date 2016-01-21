app.controller('BackUpOrgProdCtrl', function($scope, $http, $location,
		$rootScope, $localStorage) {

	var userDetails = $localStorage.userDetails;
	$rootScope.userDetails = userDetails;
	if (!userDetails || !userDetails.userLoggedIn) {
		$location.path('/login');
	}
	$scope.logout = function() {
		$localStorage.userDetails = undefined;
	};

	$scope.orgs = [];
	$scope.showOther = false;
	$scope.orgText = "";
	var orgs = $rootScope.userDetails.organizations || [];
	for (var i = 0; i < orgs.length; i++) {
		$scope.orgs.push(orgs[i]);
	}
	$scope.orgs.push('Other');
	$scope.changeOrg = function(event) {
		if ($scope.organization == 'Other') {
			$scope.orgText = "";
			$scope.showOther = true;
		} else {
			$scope.showOther = false;
		}
	}

	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";

	$scope.backUpOrgProd = function() {
		var org = $scope.organization;
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}
		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backupsubsystems?sys=" + "apiproducts",
				commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.backUpzip += "Products backuped Successfully\n";
			$scope.organization = "";
			$scope.proxyData = data;
			console.log($scope.proxyData);
			$scope.showLoader = "N";
		});
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});