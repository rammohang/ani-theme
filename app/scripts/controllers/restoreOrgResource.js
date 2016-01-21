app.controller('RestoreOrgResourceCtrl', function($scope, $http, $location,
		$rootScope, $localStorage) {
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

	var userDetails = $localStorage.userDetails;
	$rootScope.userDetails = userDetails;
	if (!userDetails || !userDetails.userLoggedIn) {
		$location.path('/login');
	}
	$scope.logout = function() {
		$localStorage.userDetails = undefined;
	};

	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.orgHis = "";
	$scope.showLoader = "N";

	$scope.fetchOrgHistory = function() {
		var org = $scope.organization;
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}

		$scope.showLoader = "Y";

		$scope.curPage = 0;
		$scope.pageSize = 3;
		$scope.numberOfPages = function() {
			return Math.ceil($scope.orgHis.length / $scope.pageSize);
		};

		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getorgbackuphistory?sys=" + "resources",
				commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.showLoader = "N";
			//$scope.backUpzip+= "Restored API Proxies successfully\n";
			$scope.organization = "";
			$scope.orgHis = data;
			console.log($scope.orgHis);
		});
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}

	$scope.restoreOrg = function(oid, filename) {
		var org = $scope.organization;
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}

		alert(oid);
		$scope.oid = oid;
		$scope.filename = filename;
		$scope.showLoader = "Y";
		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/restoreorg?oid=" + $scope.oid + "&filename="
				+ $scope.filename + "&sys=" + "resources", commonConfiguration,
				{});
		responsePromise.success(function(data, status, headers, config) {
			$scope.showLoader = "N";
			$scope.backUpzip += "Resources Restored successfully\n";
			$scope.organization = "";
			$scope.orgHis = data;
			console.log($scope.orgHis);
		});
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}

});