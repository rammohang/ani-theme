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
		controller : 'CleanOrgCtrl'
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
	$rootScope.userName = "mraviteja48@gmail.com";
	$rootScope.password = "Ravi548$";
});

app.controller('LoginCtrl', function($scope, $location, $rootScope) {
	$scope.submit = function() {
		$rootScope.userId = $scope.userId;
		$rootScope.password = $scope.password;
		// write authentication api call here.
		$scope.userLoggedIn = true; // this should be set to true, if authentication is successful
		// use $rootScope.baseUrl as prefix all the api calls
		// redirect to dashboard upon successful authentication.
		$location.path('/dashboard');
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
	$scope.backUpSuccess = "";
	$scope.backUpApps = "";
	$scope.backUpDev = "";
	$scope.backUpProd = "";
	$scope.backUpRes = "";
	
	$scope.proxyData = "";
	$scope.backUpOrg = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"backUpLocation" : $scope.backUpLocation
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backuporg?backup="+"apiProxy", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.backUpSuccess = "Backup Of API Proxies has beeen done Successfully";
			// call internally backup apps
			var responsePromise = $http.post($rootScope.baseUrl
					+ "apigee/backuporg?backup="+"apps", commonConfiguration, {});
			responsePromise.success(function(data, status, headers, config) {
				$scope.backUpApps+= "Backup Of APPS has beeen done Successfully\n";
				//call internally backup dev
				var responsePromise = $http.post($rootScope.baseUrl
						+ "apigee/backuporg?backup="+"apiDevs", commonConfiguration, {});
				responsePromise.success(function(data, status, headers, config) {
					$scope.backUpDev+= "Backup Of Developers has beeen done Successfully\n";
					// call of backup products
					var responsePromise = $http.post($rootScope.baseUrl
							+ "apigee/backuporg?backup="+"apiProds", commonConfiguration, {});
					responsePromise.success(function(data, status, headers, config) {
						$scope.backUpProd+= "Backup Of Products has beeen done Successfully\n";
								// call of backup resources
						var responsePromise = $http.post($rootScope.baseUrl
								+ "apigee/backuporg?backup="+"apiRes", commonConfiguration, {});
						responsePromise.success(function(data, status, headers, config) {
							$scope.backUpRes+= "Backup Of Resources has beeen done Successfully\n";
							$scope.organization = "";
							$scope.backUpLocation = "";
							$scope.proxyData = data;
							console.log($scope.proxyData);
						});
						responsePromise.error(function(data, status, headers, config) {
							alert("Submitting form failed!");
						});
								// resources call done
					});
					responsePromise.error(function(data, status, headers, config) {
						alert("Submitting form failed!");
					});
							
					// products backup done
				});
				responsePromise.error(function(data, status, headers, config) {
					alert("Submitting form failed!");
				});
						
				
				
				
				//backup dev done
			});
			responsePromise.error(function(data, status, headers, config) {
				alert("Submitting form failed!");
			});
			//internal call done
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});
