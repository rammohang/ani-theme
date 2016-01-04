'use strict';
/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
var app = angular.module('yapp', [ 'ngRoute', 'ngAnimate' ]);

app.config(function($httpProvider) {
	 $httpProvider.defaults.timeout = 50000;
});


app.config(function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'views/login.html',
		controller : 'LoginCtrl'
	}).when('/dashboard', {
		templateUrl : 'views/dashboard.html',
		controller : 'DashboardCtrl'
	}).when('/backUpOrg', {
		templateUrl : 'views/backUpOrg.html',
		controller : 'BackUpOrgCtrl'
	}).when('/cleanOrg', {
		templateUrl : 'views/cleanOrg.html',
			controller : 'CleanUpOrgCtrl'	
	}).when('/restoreOrg', {
		templateUrl : 'views/restoreOrg.html',
			controller : 'RestoreOrgCtrl'
	}).when('/deleteProxy', {
		templateUrl : 'views/deleteProxy.html',
		controller : 'DeleteProxyCtrl'
	}).when('/undeployProxy', {
		templateUrl : 'views/undeployProxy.html',
		controller : 'UndeployProxyCtrl'
	}).when('/deployProxy', {
		templateUrl : 'views/deployProxy.html',
		controller : 'DeployProxyCtrl'
	}).when('/createProxy', {
		templateUrl : 'views/createProxy.html',
		controller : 'CreateProxyCtrl'
	}).when('/getProxy', {
		templateUrl : 'views/getAPIProxy.html',
		controller : 'GetProxyCtrl'
	}).otherwise({
		redirectTo : '/login'
	});
});

// declare global constants here
app.run(function($rootScope) {
	$rootScope.baseUrl = "http://localhost:8084/apigee_rest/services/";
	$rootScope.userName = "itsmevenkee@gmail.com";
	$rootScope.password = "Venkat@3765";
	$rootScope.userLoggedIn = false;
});

app.controller('LoginCtrl', function($scope, $http, $location, $rootScope) {
	$scope.submit = function() {
		var userDetails = {
			"userName" : $scope.userName,
			"password" : $scope.password
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "user/authenticate", userDetails, {});
		responsePromise.success(function(data, status, headers, config) {
			alert("success" + data);
			if(data.userName) {
				$rootScope.userName = data.userName;
				$rootScope.password = data.password;
				$scope.userLoggedIn = true;
				$location.path('/dashboard');
			} else {
				alert("Invalid username/password. Please try again !!");
			}
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
		
		return false;
	}
});

app.controller('DashboardCtrl', function($scope, $location) {
	
});

app.controller('DeleteProxyCtrl', function($http, $scope, $rootScope) {
	$scope.deleteApiProxy = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deleteapi", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});

app.controller('UndeployProxyCtrl', function($http, $scope, $rootScope) {
	$scope.undeployProxy = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName,
			"environment" : $scope.environment,
			"revision" : $scope.revision
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/undeployproxy", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			$scope.environment = "";
			$scope.revision = "";
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});

app.controller('DeployProxyCtrl', function($http, $scope, $rootScope) {
	$scope.deployProxy = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName,
			"environment" : $scope.environment,
			"revision" : $scope.revision
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deployapiproxy", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			$scope.environment = "";
			$scope.revision = "";
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});

app.controller('CreateProxyCtrl', function($http, $scope, $rootScope) {
	$scope.createAPIProxy = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/createproxy", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});

app.controller('GetProxyCtrl', function($scope, $location, $rootScope, $http) {
	$scope.proxyData = "";
	$scope.getAPIProxy = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getapiproxy", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			$scope.proxyData = data;
			console.log($scope.proxyData);
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});

app.controller('BackUpOrgCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	$scope.enable = true;
	
	$scope.catchKeys = function(){
		if($scope.organization.length > 0){
			$scope.enable = false;
		}else{
			$scope.enable = true;
		}
	}
	
	$scope.backUpOrg = function() {
		
	
		
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backuporg", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "Backup Created Successfully\n";
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




app.controller('RestoreOrgCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.orgHis = "";
	$scope.showLoader = "N";
	
	/*$scope.restoreOrg = function() {
		$scope.showLoader = "Y";
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/restoreorg", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.backUpzip+= "Restored Organization Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}*/
	
	
	$scope.fetchOrgHistory = function() {
		$scope.showLoader = "Y";
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getorgbackuphistory", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.backUpzip+= "Org Data Fetched successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	$scope.restoreOrg = function(oid,filename) {
		alert(oid);
		$scope.oid = oid;
		$scope.filename = filename;
		$scope.showLoader = "Y";
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/restoreorg?oid="+$scope.oid+"&filename="+$scope.filename, commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.backUpzip+= "Organization Restored successfully\n";
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


app.controller('CleanUpOrgCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	$scope.cleanUpOrg = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/cleanorg", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "Cleaned Organization Successfully\n";
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
